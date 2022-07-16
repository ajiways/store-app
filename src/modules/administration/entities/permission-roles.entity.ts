import { Column, Entity, ManyToOne } from 'typeorm';
import { CreatedEntity } from '../../../common/created.entity';
import { PermissionEntity } from './permission.entity';
import { RoleEntity } from './role.entity';

@Entity('permission_roles')
export class PermissionRolesEntity extends CreatedEntity {
  @Column({ type: 'uuid', nullable: false })
  permissionId: string;

  @Column({ type: 'uuid', nullable: false })
  roleId: string;

  @ManyToOne(() => RoleEntity, { nullable: false })
  private role: RoleEntity;

  @ManyToOne(() => PermissionEntity, { nullable: false })
  private permission: PermissionEntity;
}
