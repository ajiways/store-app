import { Column, Entity, ManyToOne } from 'typeorm';
import { CreatedEntity } from '../../../common/created.entity';
import { RoleEntity } from './role.entity';
import { UserEntity } from './user.entity';

@Entity('user_roles')
export class UserRolesEntity extends CreatedEntity {
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'uuid', nullable: false })
  roleId: string;

  @ManyToOne(() => RoleEntity, { nullable: false })
  private role: RoleEntity;

  @ManyToOne(() => UserEntity, { nullable: false })
  private user: UserEntity;
}
