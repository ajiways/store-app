import { RoleEntity } from '../../administration/entities/role.entity';

export interface TokenResponse {
  userId: string;
  token: string;
  refreshToken: string;
  userRoles: Pick<RoleEntity, 'id'>[];
}
