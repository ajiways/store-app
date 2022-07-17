import { UserEntity } from '../../administration/entities/user.entity';

export class SaveRefreshTokenDTO {
  user: UserEntity;
  refreshToken: string;
  id?: string | undefined;
}
