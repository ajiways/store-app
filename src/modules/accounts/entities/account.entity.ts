import { Column, Entity, OneToOne } from 'typeorm';
import { EditedEntity } from '../../../common/created.entity';
import { UserEntity } from '../../administration/entities/user.entity';

@Entity('accounts')
export class AccountEntity extends EditedEntity {
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  balance: number;

  @OneToOne(() => UserEntity, { nullable: false })
  private user: UserEntity;
}
