import { Column, Entity, ManyToOne } from 'typeorm';
import { CreatedEntity } from '../../../common/created.entity';
import { UserEntity } from '../../administration/entities/user.entity';
import { ItemEntity } from '../../items/intities/item.entity';
import { TransactionEntity } from './transaction.entity';

@Entity('purchases')
export class PurchaseEntity extends CreatedEntity {
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'uuid', nullable: false })
  transactionId: string;

  @Column({ type: 'uuid', nullable: true })
  purchaseId: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @ManyToOne(() => UserEntity, { nullable: false })
  private user: UserEntity;

  @ManyToOne(() => ItemEntity, { nullable: false })
  private item: ItemEntity;

  @ManyToOne(() => TransactionEntity, { nullable: true })
  private transaction?: TransactionEntity;
}
