import { BadRequestException, Inject } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ETransactionType } from '../../../common/enums/transaction-types.enum';
import { AbstractService } from '../../../common/services/abstract.service';
import { UserEntity } from '../../administration/entities/user.entity';
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

    const account = await this.accountService.getUserAccount(user, manager);

    if (account.balance < item.price) {
      throw new BadRequestException('Not enough currency to make purchase');
    }

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
