import { Column, Entity, ManyToOne } from 'typeorm';
import { EditedEntity } from '../../../common/created.entity';
import { EOfferStatus } from '../../../common/enums/offer-status.enum';
import { UserEntity } from '../../administration/entities/user.entity';

@Entity('offers')
export class OfferEntity extends EditedEntity {
  @Column({ type: 'uuid', nullable: false })
  userFromId: string;

  @Column({ type: 'uuid', nullable: false })
  userToId: string;

  @Column({ type: 'jsonb', nullable: false })
  itemsAndPrices: { itemId: string; price: number }[];

  @Column({ type: 'enum', enum: EOfferStatus, nullable: false })
  status: EOfferStatus;

  @ManyToOne(() => UserEntity, { nullable: false })
  private userFrom: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: false })
  private userTo: UserEntity;
}
