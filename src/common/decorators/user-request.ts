import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../modules/administration/entities/user.entity';

export interface UserRequest extends Request {
  user: UserEntity;
}

export const UserRequest = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<UserRequest>();
    return req.user;
  },
);
