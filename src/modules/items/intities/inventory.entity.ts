import { Column, Entity, OneToOne } from 'typeorm';
import { CreatedEntity } from '../../../common/created.entity';
import { UserEntity } from '../../administration/entities/user.entity';

@Entity('inventories')
export class InventoryEntity extends CreatedEntity {
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @OneToOne(() => UserEntity, { nullable: false })
  private user: UserEntity;
}
