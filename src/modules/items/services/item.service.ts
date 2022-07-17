import { HttpStatus } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EntityManager } from 'typeorm';
import { AbstractService } from '../../../common/services/abstract.service';
import { SaveItemDTO } from '../dto/save-item.dto';
import { SaveItemResponseDTO } from '../dto/save-item.response.dto';
import { ItemServiceInterface } from '../interfaces/items.service.interface';
import { ItemEntity } from '../intities/item.entity';

export class ItemService
  extends AbstractService<ItemEntity>
  implements ItemServiceInterface
{
  protected Entity = ItemEntity;

  protected async validateEntitiesBeforeSave(
    entities: Partial<ItemEntity>[],
    manager: EntityManager,
  ): Promise<void> {
    //TODO: nothing to do
  }

  async save(
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
}
