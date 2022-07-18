import { EntityManager } from 'typeorm';
import { BaseServiceInterface } from '../../../common/base-service.interface';
import { UserEntity } from '../../administration/entities/user.entity';
import { InventoryEntity } from '../intities/inventory.entity';

export interface InventoryServiceInterface
  extends BaseServiceInterface<InventoryEntity> {
  save(user: UserEntity, manager?: EntityManager): Promise<InventoryEntity>;
  getUserInventory(
    user: UserEntity,
    manager?: EntityManager,
  ): Promise<InventoryEntity>;
}
