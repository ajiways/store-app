import { EntityManager } from 'typeorm';
import { BaseServiceInterface } from '../../../common/base-service.interface';
import { GetInventoryItemsDTO } from '../dto/get-inventory-items.dto';
import { GetItemInfoResponseDTO } from '../dto/get-item-info.response.dto';
import { GetItemListResponseDTO } from '../dto/get-items-list.response.dto';
import { SaveItemDTO } from '../dto/save-item.dto';
import { SaveItemResponseDTO } from '../dto/save-item.response.dto';
import { UpdateItemDTO } from '../dto/update-item.dto';
import { ItemEntity } from '../intities/item.entity';

export interface ItemServiceInterface extends BaseServiceInterface<ItemEntity> {
  getItemsList(
    dto: GetInventoryItemsDTO,
    manager?: EntityManager,
  ): Promise<GetItemListResponseDTO>;

  getItemInfo(
    id: string,
    manager?: EntityManager,
  ): Promise<GetItemInfoResponseDTO>;

  save(
    files: {
      main: Express.Multer.File[];
      additional: Express.Multer.File[];
    },
    dto: SaveItemDTO,
    manager?: EntityManager,
  ): Promise<SaveItemResponseDTO>;

  update(
    files: {
      main: Express.Multer.File[];
      additional: Express.Multer.File[];
    },
    id: string,
    dto: UpdateItemDTO,
    manager?: EntityManager,
  ): Promise<SaveItemResponseDTO>;
}
