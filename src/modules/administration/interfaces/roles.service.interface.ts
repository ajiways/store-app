import { EntityManager } from 'typeorm';
import { BaseServiceInterface } from '../../../common/base-service.interface';
import { ERoles } from '../../../common/enums/roles.enum';
import { PermissionEntity } from '../entities/permission.entity';
import { RoleEntity } from '../entities/role.entity';
import { UserEntity } from '../entities/user.entity';

export interface RolesServiceInterface
  extends BaseServiceInterface<RoleEntity> {
  getUserRoles(userId: string, manager?: EntityManager): Promise<RoleEntity[]>;

  addRoleToUser(
    role: ERoles,
    user: UserEntity,
    manager?: EntityManager,
  ): Promise<boolean>;

  getUserPermissions(
    user: UserEntity,
    manager?: EntityManager,
  ): Promise<PermissionEntity[]>;
}
