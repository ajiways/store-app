import { UserEntity } from '../../administration/entities/user.entity';

export interface RequestInterface {
  headers: {
    'x-user-id': string | undefined;
    authorization: string | undefined;
    refreshToken: string | undefined;
  };
  cookies: {
    refreshToken: string | undefined;
  };
  user: UserEntity;
}
