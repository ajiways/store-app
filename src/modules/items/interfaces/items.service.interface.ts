import { EntityManager } from 'typeorm';
import { BaseServiceInterface } from '../../../common/base-service.interface';
import { SaveItemDTO } from '../dto/save-item.dto';
import { SaveItemResponseDTO } from '../dto/save-item.response.dto';
import { ItemEntity } from '../intities/item.entity';

export interface ItemServiceInterface extends BaseServiceInterface<ItemEntity> {
  save(
    files: {
      main: Express.Multer.File[];
      additional: Express.Multer.File[];
    },
    dto: SaveItemDTO,
    manager?: EntityManager,
  ): Promise<SaveItemResponseDTO>;
}
