import { Column, Entity, ManyToOne } from 'typeorm';
import { EditedEntity } from '../../../common/created.entity';
import { UserEntity } from '../../administration/entities/user.entity';

@Entity('refresh_tokens')
export class RefreshTokenEntity extends EditedEntity {
  @ManyToOne(() => UserEntity, { nullable: false })
  private user?: UserEntity;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'varchar', nullable: false })
  refreshToken: string;
}
