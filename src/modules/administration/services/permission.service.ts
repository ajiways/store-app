import { EntityManager } from 'typeorm';
import { AbstractService } from '../../../common/services/abstract.service';
import { PermissionEntity } from '../entities/permission.entity';
import { PermissionServiceInterface } from '../interfaces/permission.service.interface';

export class PermissionService
  extends AbstractService<PermissionEntity>
  implements PermissionServiceInterface
{
  protected Entity = PermissionEntity;

  protected async validateEntitiesBeforeSave(
    entities: Partial<PermissionEntity>[],
    manager: EntityManager,
  ): Promise<void> {
    //TODO: nothing to do
  }
}
