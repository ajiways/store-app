import { EntityManager, In } from 'typeorm';
import { AbstractService } from '../../../common/services/abstract.service';
import { PermissionRolesEntity } from '../entities/permission-roles.entity';
import { RoleEntity } from '../entities/role.entity';
import { PermissionRolesServiceInterface } from '../interfaces/permission-roles.service.interface';

export class PermissionRolesService
  extends AbstractService<PermissionRolesEntity>
  implements PermissionRolesServiceInterface
{
  protected Entity = PermissionRolesEntity;

  protected async validateEntitiesBeforeSave(
    entities: Partial<PermissionRolesEntity>[],
    manager: EntityManager,
  ): Promise<void> {
    //TODO: nothing to do
  }

  async getPermissionsByRole(
    role: RoleEntity | RoleEntity[],
    manager: EntityManager | undefined,
  ): Promise<PermissionRolesEntity[]> {
    if (!manager) {
      manager = this.connection.manager;
    }

    if (role instanceof Array) {
      return await this.findWhere(
        { roleId: In(role.map((i) => i.id)) },
        manager,
      );
    }

    return await this.findWhere({ roleId: role.id }, manager);
  }
}
