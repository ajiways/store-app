import { Column, Entity, ManyToOne } from 'typeorm';
import { CreatedEntity } from '../../../common/created.entity';
import { ETransactionType } from '../../../common/enums/transaction-types.enum';
import { AccountEntity } from './account.entity';

@Entity('transactions')
export class TransactionEntity extends CreatedEntity {
  @Column({ type: 'uuid', nullable: false })
  accountId: string;

  @Column({ type: 'int', nullable: false })
  amount: number;

  @Column({ type: 'enum', enum: ETransactionType, nullable: false })
  type: ETransactionType;

  @ManyToOne(() => AccountEntity, { nullable: false })
  private account: AccountEntity;
}
