import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { keyBy } from 'lodash';
import { EPermissions } from '../../../common/enums/permissions.enum';
import { RolesServiceInterface } from '../../administration/interfaces/roles.service.interface';
import { UserServiceInterface } from '../../administration/interfaces/user.service.interface';
import { RolesService } from '../../administration/services/roles.service';
import { UserService } from '../../administration/services/user.service';
import { RequestInterface } from '../interfaces/request.interface';

export const RequirePermissions = (permission: EPermissions[]) =>
  SetMetadata('requiredPermissions', permission);

@Injectable()
export class RolesGuard implements CanActivate {
  @Inject()
  private readonly reflector: Reflector;

  @Inject(RolesService)
  private readonly rolesService: RolesServiceInterface;

  @Inject(UserService)
  private readonly userService: UserServiceInterface;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { headers } = context.switchToHttp().getRequest<RequestInterface>();

    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    if (!headers['x-user-id'] || headers['x-user-id'] === 'null') {
      return false;
    }

    const user = await this.userService.findById(headers['x-user-id']);

    const requiredPermissions =
      this.reflector.get<EPermissions[]>(
        'requiredPermissions',
        context.getHandler(),
      ) || [];

    if (!requiredPermissions.length) {
      return true;
    }

    const requiredPermissionsCount = requiredPermissions.length;

    const userPermissions = await this.rolesService.getUserPermissions(user);

    const userPermissionsByType = keyBy(userPermissions, ({ name }) => name);

    let matchedPermissions = 0;

    for (const permission of requiredPermissions) {
      if (userPermissionsByType[permission.toUpperCase()]) {
        matchedPermissions++;
      }
    }

    if (matchedPermissions !== requiredPermissionsCount) {
      return false;
    }

    return true;
  }
}
