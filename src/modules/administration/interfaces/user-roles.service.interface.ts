import { EntityManager } from 'typeorm';
import { BaseServiceInterface } from '../../../common/base-service.interface';
import { RoleEntity } from '../entities/role.entity';
import { UserRolesEntity } from '../entities/user-roles.entity';
import { UserEntity } from '../entities/user.entity';

export interface UserRolesServiceInterface
  extends BaseServiceInterface<UserRolesEntity> {
  save(
    role: RoleEntity,
    user: UserEntity,
    manager?: EntityManager,
  ): Promise<UserRolesEntity>;
}
