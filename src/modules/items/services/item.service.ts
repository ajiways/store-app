import { BadRequestException, HttpStatus, Inject } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { existsSync, unlink } from 'fs';
import { resolve } from 'path';
import { EntityManager } from 'typeorm';
import { ConfigurationService } from '../../../common/configuration/configuration.service';
import { AbstractService } from '../../../common/services/abstract.service';
import { GetInventoryItemsDTO } from '../dto/get-inventory-items.dto';
import { GetItemInfoResponseDTO } from '../dto/get-item-info.response.dto';
import { GetItemListResponseDTO } from '../dto/get-items-list.response.dto';
import { SaveItemDTO } from '../dto/save-item.dto';
import { SaveItemResponseDTO } from '../dto/save-item.response.dto';
import { UpdateItemDTO } from '../dto/update-item.dto';
import { ItemServiceInterface } from '../interfaces/items.service.interface';
import { ItemEntity } from '../intities/item.entity';

export class ItemService
  extends AbstractService<ItemEntity>
  implements ItemServiceInterface
{
  @Inject()
  private readonly configService: ConfigurationService;

  protected Entity = ItemEntity;

  protected async validateEntitiesBeforeSave(
    entities: Partial<ItemEntity>[],
    manager: EntityManager,
  ): Promise<void> {
    //TODO: nothing to do
  }

  public async save(
    files: {
      main: Express.Multer.File[];
      additional: Express.Multer.File[];
    },
    dto: SaveItemDTO,
    manager: EntityManager | undefined,
  ): Promise<SaveItemResponseDTO> {
    if (!manager) {
      return this.startTransaction((manager) => this.save(files, dto, manager));
    }

    const item = await this.saveEntity(
      {
        ...dto,
        images: [
          ...files.additional.map((i) => i.filename),
          ...files.main.map((i) => i.filename),
        ],
      },
      manager,
    );

    return plainToInstance(SaveItemResponseDTO, {
      status: HttpStatus.CREATED,
      message: 'Successfully created',
      data: item,
    });
  }

  public async update(
    files: {
      main: Express.Multer.File[];
      additional: Express.Multer.File[];
    },
    id: string,
    dto: UpdateItemDTO,
    manager: EntityManager | undefined,
  ): Promise<SaveItemResponseDTO> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.update(files, id, dto, manager),
      );
    }

    const candidate = await this.findOneOrFail({ id }, manager);

    const newImages = this.handleImagesChange(
      candidate,
      dto.filesToDelete,
      files,
    );

    await this.updateEntity(
      { id },
      {
        description: dto.description,
        images: newImages,
        name: dto.name,
        price: dto.price,
        type: dto.type,
        enabled: dto.enabled,
      },
      manager,
    );

    return plainToInstance(SaveItemResponseDTO, {
      status: HttpStatus.CREATED,
      message: 'Successfully updated',
      data: {
        ...candidate,
        ...{
          description: dto.description,
          images: newImages,
          name: dto.name,
          price: dto.price,
          type: dto.type,
          enabled: dto.enabled,
        },
      },
    });
  }

  private handleImagesChange(
    item: ItemEntity,
    imagesToDelete: string[],
    files: {
      main: Express.Multer.File[];
      additional: Express.Multer.File[];
    },
  ) {
    for (const image of imagesToDelete) {
      if (!item.images.includes(image)) {
        throw new BadRequestException(
          'Wrong image to delete (does not exists on this file)',
        );
      }
    }

    const newImages = item.images.filter(
      (image) => !imagesToDelete.includes(image),
    );

    const maxImagesCount = this.configService.env.IMAGES_COUNT_PER_ITEM;

    if (
      newImages.length + files.additional.length + files.main.length >
      maxImagesCount
    ) {
      throw new BadRequestException(
        `More than ${maxImagesCount} images per item is disallowed`,
      );
    }

    for (const itemToDelete of imagesToDelete) {
      const pathToItem = resolve(
        __dirname,
        '../../../../uploads/' + itemToDelete,
      );

      if (existsSync(pathToItem)) {
        unlink(pathToItem, () => {});
      }
    }

    for (const image of files.additional) {
      newImages.push(image.filename);
    }
    for (const image of files.main) {
      newImages.push(image.filename);
    }

    return newImages;
  }

  public async getItemInfo(
    id: string,
    manager: EntityManager | undefined,
  ): Promise<GetItemInfoResponseDTO> {
    if (!manager) {
      manager = this.connection.manager;
    }

    const item = await this.findOneWhere({ id, enabled: true }, manager);

    return plainToInstance(GetItemInfoResponseDTO, {
      message: 'Succesfully',
      status: HttpStatus.OK,
      data: item,
    });
  }

  public async getItemsList(
    dto: GetInventoryItemsDTO,
    manager: EntityManager | undefined,
  ): Promise<GetItemListResponseDTO> {
    if (!manager) {
      manager = this.connection.manager;
    }

    const { where, take, skip } = this.findWhereParams(
      { enabled: true },
      { take: dto.take, skip: dto.skip },
    );

    const data = await this.findWhere(where, manager, { take, skip });

    return plainToInstance(GetItemListResponseDTO, {
      message: 'Successfully',
      data,
      status: HttpStatus.OK,
    });
  }
}
