import { InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { AbstractService } from '../../../common/services/abstract.service';
import { UserEntity } from '../../administration/entities/user.entity';
import { InventoryServiceInterface } from '../interfaces/inventory.service.interface';
import { InventoryEntity } from '../intities/inventory.entity';
import { ItemEntity } from '../intities/item.entity';

export class InventoryService
  extends AbstractService<InventoryEntity>
  implements InventoryServiceInterface
{
  protected Entity = InventoryEntity;

  protected async validateEntitiesBeforeSave(
    entities: Partial<ItemEntity>[],
    manager: EntityManager,
  ): Promise<void> {
    //TODO: nothing to do
  }

  public async save(
    user: UserEntity,
    manager: EntityManager | undefined,
  ): Promise<InventoryEntity> {
    if (!manager) {
      return this.startTransaction((manager) => this.save(user, manager));
    }

    return await this.saveEntity({ userId: user.id }, manager);
  }

  public async getUserInventory(
    user: UserEntity,
    manager: EntityManager | undefined,
  ): Promise<InventoryEntity> {
    if (!manager) {
      manager = this.connection.manager;
    }

    const userInventory = await this.findOneWhere({ userId: user.id }, manager);

    if (!userInventory) {
      throw new InternalServerErrorException(
        "This user doesn't have an inventory, please, contact the system administrator",
      );
    }

    return userInventory;
  }
}
