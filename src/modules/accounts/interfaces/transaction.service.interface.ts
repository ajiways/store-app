import { EntityManager } from 'typeorm';
import { BaseServiceInterface } from '../../../common/base-service.interface';
import { ETransactionType } from '../../../common/enums/transaction-types.enum';
import { AccountEntity } from '../entities/account.entity';
import { TransactionEntity } from '../entities/transaction.entity';

export interface TransactionServiceInterface
  extends BaseServiceInterface<TransactionEntity> {
  save(
    account: AccountEntity,
    type: ETransactionType,
    amount: number,
    manager?: EntityManager,
  ): Promise<TransactionEntity>;
}
