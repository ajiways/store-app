import { Inject, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { AbstractService } from '../../../common/services/abstract.service';
import { UserEntity } from '../../administration/entities/user.entity';
import { GetInventoryItemsDTO } from '../dto/get-inventory-items.dto';
import { InventoryItemServiceInterface } from '../interfaces/inventory-item.service.interface';
import { InventoryItemsEntity } from '../intities/inventory-items.entity';
import { InventoryEntity } from '../intities/inventory.entity';
import { ItemEntity } from '../intities/item.entity';
import { InventoryService } from './inventory.service';
import { ItemService } from './item.service';

export class InventoryItemService
  extends AbstractService<InventoryItemsEntity>
  implements InventoryItemServiceInterface
{
  @Inject()
  private readonly inventoryService: InventoryService;

  @Inject()
  private readonly itemService: ItemService;

  protected Entity = InventoryItemsEntity;

  protected async validateEntitiesBeforeSave(
    entities: Partial<ItemEntity>[],
    manager: EntityManager,
  ): Promise<void> {
    //TODO: nothing to do
  }

  public async addToInventory(
    inventory: InventoryEntity,
    item: ItemEntity,
    manager: EntityManager | undefined,
  ): Promise<boolean> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.addToInventory(inventory, item, manager),
      );
    }

    await this.saveEntity(
      { inventoryId: inventory.id, itemId: item.id },
      manager,
    );

    return true;
  }

  public async getInventoryItems(
    dto: GetInventoryItemsDTO,
    user: UserEntity,
    manager: EntityManager | undefined,
  ): Promise<ItemEntity[]> {
    if (!manager) {
      manager = this.connection.manager;
    }

    const inventory = await this.inventoryService.findOneWhere(
      { userId: user.id },
      manager,
    );

    if (!inventory) {
      throw new InternalServerErrorException(
        "This user doesn't have an inventory, please contact the system administrator",
      );
    }

    const { where, take, skip } = this.findWhereParams(
      { inventoryId: inventory.id },
      { skip: dto.skip, take: dto.take },
    );

    const inventoryItems = await this.findWhere(where, manager, { take, skip });

    //FIXME: если два предмета одинаковых в инвентаре, то вернется только 1
    return await this.itemService.findByIds(
      inventoryItems.map((i) => i.itemId),
      manager,
    );
  }
}
