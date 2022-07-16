import { Inject, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { AbstractService } from '../../../common/services/abstract.service';
import { UserService } from '../../administration/services/user.service';
import { SaveRefreshTokenDTO } from '../dto/save-refresh-token.dto';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { RefreshTokenServiceInterface } from '../interfaces/refresh-token.service.interface';

export class RefreshTokenService
  extends AbstractService<RefreshTokenEntity>
  implements RefreshTokenServiceInterface
{
  protected Entity = RefreshTokenEntity;

  @Inject()
  private usersService: UserService;

  protected async validateEntitiesBeforeSave(
    entities: Partial<RefreshTokenEntity>[],
    manager: EntityManager,
  ): Promise<void> {
    await this.usersService.findByIds(
      entities.map((i) => {
        if (!i.userId)
          throw new InternalServerErrorException('No user for refresh token');
        return i.userId;
      }),
      manager,
    );
  }

  async save(
    dto: SaveRefreshTokenDTO,
    manager: EntityManager | undefined,
  ): Promise<RefreshTokenEntity> {
    if (!manager) {
      return this.startTransaction((manager) => this.save(dto, manager));
    }

    return await this.saveEntity(
      {
        userId: dto.user.id,
        refreshToken: dto.refreshToken,
        id: dto.id,
      },
      manager,
    );
  }

  async findByRefreshToken(
    refreshToken: string,
    manager: EntityManager | undefined,
  ): Promise<RefreshTokenEntity | undefined> {
    if (!manager) {
      manager = this.connection.manager;
    }

    return await this.findOneWhere({ refreshToken }, manager);
  }

  async findByUserId(
    userId: string,
    manager: EntityManager | undefined,
  ): Promise<RefreshTokenEntity | undefined> {
    if (!manager) {
      manager = this.connection.manager;
    }

    return await this.findOneWhere({ userId }, manager);
  }

  async delete(
    entity: RefreshTokenEntity,
    manager?: EntityManager,
  ): Promise<boolean> {
    if (!manager) {
      return this.startTransaction((manager) => this.delete(entity, manager));
    }

    return await this.deleteEntities([entity], manager);
  }
}
