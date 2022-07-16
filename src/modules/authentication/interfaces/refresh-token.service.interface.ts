import { EntityManager } from 'typeorm';
import { BaseServiceInterface } from '../../../common/base-service.interface';
import { SaveRefreshTokenDTO } from '../dto/save-refresh-token.dto';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';

export interface RefreshTokenServiceInterface
  extends BaseServiceInterface<RefreshTokenEntity> {
  save(
    dto: SaveRefreshTokenDTO,
    manager?: EntityManager,
  ): Promise<RefreshTokenEntity>;

  findByRefreshToken(
    refreshToken: string,
    manager?: EntityManager,
  ): Promise<RefreshTokenEntity | undefined>;

  findByUserId(
    userId: string,
    manager?: EntityManager,
  ): Promise<RefreshTokenEntity | undefined>;

  delete(entity: RefreshTokenEntity, manager?: EntityManager): Promise<boolean>;
}
