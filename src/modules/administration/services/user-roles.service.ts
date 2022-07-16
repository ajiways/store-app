import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { AbstractService } from '../../../common/services/abstract.service';
import { RoleEntity } from '../entities/role.entity';
import { UserRolesEntity } from '../entities/user-roles.entity';
import { UserEntity } from '../entities/user.entity';
import { UserRolesServiceInterface } from '../interfaces/user-roles.service.interface';

@Injectable()
export class UserRolesService
  extends AbstractService<UserRolesEntity>
  implements UserRolesServiceInterface
{
  protected Entity = UserRolesEntity;

  protected async validateEntitiesBeforeSave(
    entities: Partial<UserRolesEntity>[],
    manager: EntityManager,
  ): Promise<void> {
    //TODO: nothing to do
  }

  public async save(
    role: RoleEntity,
    user: UserEntity,
    manager: EntityManager | undefined,
  ): Promise<UserRolesEntity> {
    if (!manager) {
      return this.startTransaction((manager) => this.save(role, user, manager));
    }

    return await this.saveEntity({ roleId: role.id, userId: user.id }, manager);
  }
}
