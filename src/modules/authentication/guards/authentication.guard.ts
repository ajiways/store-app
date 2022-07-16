import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Inject,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

export const Public = () => SetMetadata('isPublic', true);

@Injectable()
export class AuthenticationGuard extends AuthGuard('jwt') {
  @Inject()
  private readonly reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: Error, user: Record<any, any>) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
