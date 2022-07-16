import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ERoles } from '../../../common/enums/roles.enum';
import { AbstractService } from '../../../common/services/abstract.service';
import { PermissionEntity } from '../entities/permission.entity';
import { RoleEntity } from '../entities/role.entity';
import { UserEntity } from '../entities/user.entity';
import { RolesServiceInterface } from '../interfaces/roles.service.interface';
import { PermissionRolesService } from './permission-roles.service';
import { PermissionService } from './permission.service';
import { UserRolesService } from './user-roles.service';

@Injectable()
export class RolesService
  extends AbstractService<RoleEntity>
  implements RolesServiceInterface
{
  @Inject()
  private readonly userRolesService: UserRolesService;

  @Inject()
  private readonly permissionRolesService: PermissionRolesService;

  @Inject()
  private readonly permissionService: PermissionService;

  protected Entity = RoleEntity;

  protected async validateEntitiesBeforeSave(
    entities: Partial<RoleEntity>[],
    manager: EntityManager,
  ): Promise<void> {
    //TODO: Nothing to do
  }

  public async getUserRoles(
    userId: string,
    manager: EntityManager | undefined,
  ): Promise<RoleEntity[]> {
    if (!manager) {
      manager = this.connection.manager;
    }

    const userRoles = await this.userRolesService.findWhere(
      { userId },
      manager,
    );

    return await this.findByIds(
      userRoles.map((i) => i.roleId),
      manager,
    );
  }

  public async addRoleToUser(
    role: ERoles,
    user: UserEntity,
    manager: EntityManager | undefined,
  ): Promise<boolean> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.addRoleToUser(role, user, manager),
      );
    }

    const existingRole = await this.findOneWhere({ name: role }, manager);

    if (!existingRole) {
      throw new InternalServerErrorException(
        "Can't find base user role, please contact the system admistrator",
      );
    }

    await this.userRolesService.save(existingRole, user, manager);

    return true;
  }

  public async getUserPermissions(
    user: UserEntity,
    manager: EntityManager | undefined,
  ): Promise<PermissionEntity[]> {
    if (!manager) {
      manager = this.connection.manager;
    }

    const userRoles = await this.getUserRoles(user.id, manager);

    const permissionRoles =
      await this.permissionRolesService.getPermissionsByRole(
        userRoles,
        manager,
      );

    return await this.permissionService.findByIds(
      permissionRoles.map((i) => i.permissionId),
      manager,
    );
  }
}
