import { EntityManager } from 'typeorm';
import { BaseServiceInterface } from '../../../common/base-service.interface';
import { PermissionRolesEntity } from '../entities/permission-roles.entity';
import { RoleEntity } from '../entities/role.entity';

export interface PermissionRolesServiceInterface
  extends BaseServiceInterface<PermissionRolesEntity> {
  getPermissionsByRole(
    role: RoleEntity | RoleEntity[],
    manager?: EntityManager,
  ): Promise<PermissionRolesEntity[]>;
}
