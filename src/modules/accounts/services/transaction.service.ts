import { EntityManager } from 'typeorm';
import { ETransactionType } from '../../../common/enums/transaction-types.enum';
import { AbstractService } from '../../../common/services/abstract.service';
import { AccountEntity } from '../entities/account.entity';
import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionServiceInterface } from '../interfaces/transaction.service.interface';

export class TransactionService
  extends AbstractService<TransactionEntity>
  implements TransactionServiceInterface
{
  protected Entity = TransactionEntity;

  protected async validateEntitiesBeforeSave(
    entities: Partial<TransactionEntity>[],
    manager: EntityManager,
  ): Promise<void> {
    //TODO: nothing to do
  }

  public async save(
    account: AccountEntity,
    type: ETransactionType,
    amount: number,
    manager: EntityManager | undefined,
  ): Promise<TransactionEntity> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.save(account, type, amount, manager),
      );
    }

    return await this.saveEntity(
      { amount, type, accountId: account.id },
      manager,
    );
  }
}
