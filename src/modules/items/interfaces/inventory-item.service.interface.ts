import { EntityManager } from 'typeorm';
import { BaseServiceInterface } from '../../../common/base-service.interface';
import { UserEntity } from '../../administration/entities/user.entity';
import { GetInventoryItemsDTO } from '../dto/get-inventory-items.dto';
import { InventoryItemsEntity } from '../intities/inventory-items.entity';
import { InventoryEntity } from '../intities/inventory.entity';
import { ItemEntity } from '../intities/item.entity';

export interface InventoryItemServiceInterface
  extends BaseServiceInterface<InventoryItemsEntity> {
  addToInventory(
    inventory: InventoryEntity,
    item: ItemEntity,
    manager?: EntityManager,
  ): Promise<boolean>;

  getInventoryItems(
    dto: GetInventoryItemsDTO,
    user: UserEntity,
    manager?: EntityManager,
  ): Promise<ItemEntity[]>;
}
