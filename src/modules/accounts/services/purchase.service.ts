import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ETransactionType } from '../../../common/enums/transaction-types.enum';
import { AbstractService } from '../../../common/services/abstract.service';
import { UserEntity } from '../../administration/entities/user.entity';
import { InventoryItemService } from '../../items/services/inventory-item.service';
import { InventoryService } from '../../items/services/inventory.service';
import { ItemService } from '../../items/services/item.service';
import { PurchaseEntity } from '../entities/purchase.entity';
import { PurchaseServiceInterface } from '../interfaces/purchase.service.interface';
import { AccountService } from './account.service';
import { TransactionService } from './transaction.service';

export class PurchaseService
  extends AbstractService<PurchaseEntity>
  implements PurchaseServiceInterface
{
  @Inject()
  private readonly transactionService: TransactionService;

  @Inject()
  private readonly accountService: AccountService;

  @Inject()
  private readonly itemService: ItemService;

  @Inject()
  private readonly inventoryItemService: InventoryItemService;

  @Inject()
  private readonly inventoryService: InventoryService;

  protected Entity = PurchaseEntity;

  protected async validateEntitiesBeforeSave(
    entities: Partial<PurchaseEntity>[],
    manager: EntityManager,
  ): Promise<void> {
    //TODO: nothing to do
  }

  public async makePurchase(
    user: UserEntity,
    itemId: string,
    manager: EntityManager | undefined,
  ): Promise<PurchaseEntity> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.makePurchase(user, itemId, manager),
      );
    }

    const item = await this.itemService.findById(itemId, manager);
    const userInventory = await this.inventoryService.findOneWhere(
      { userId: user.id },
      manager,
    );

    if (!userInventory) {
      throw new InternalServerErrorException(
        "This user doesn't have an inventory, please, contact the system administrator",
      );
    }

    const account = await this.accountService.getUserAccount(user, manager);

    if (account.balance < item.price) {
      throw new BadRequestException('Not enough currency to make purchase');
    }

    account.balance -= item.price;

    await this.inventoryItemService.addToInventory(
      userInventory,
      item,
      manager,
    );

    await this.accountService.updateEntity(
      { id: account.id },
      account,
      manager,
    );

    const transaction = await this.transactionService.save(
      account,
      ETransactionType['ORDER PAYMENT'],
      item.price,
      manager,
    );

    return await this.saveEntity(
      {
        itemId: item.id,
        price: item.price,
        userId: user.id,
        transactionId: transaction.id,
      },
      manager,
    );
  }

  public async getPurchaseHistory(
    user: UserEntity,
    manager: EntityManager | undefined,
  ): Promise<PurchaseEntity[]> {
    if (!manager) {
      manager = this.connection.manager;
    }

    return await this.findWhere({ userId: user.id }, manager);
  }
}
