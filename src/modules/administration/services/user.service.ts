import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { EntityManager } from 'typeorm';
import { ERoles } from '../../../common/enums/roles.enum';
import { AbstractService } from '../../../common/services/abstract.service';
import { AccountService } from '../../accounts/services/account.service';
import { InventoryService } from '../../items/services/inventory.service';
import { SaveUserDTO } from '../dto/save-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserServiceInterface } from '../interfaces/user.service.interface';
import { RolesService } from './roles.service';

@Injectable()
export class UserService
  extends AbstractService<UserEntity>
  implements UserServiceInterface
{
  @Inject()
  private readonly rolesService: RolesService;

  @Inject()
  private readonly inventoryService: InventoryService;

  @Inject()
  private readonly accountService: AccountService;

  protected Entity = UserEntity;

  protected async validateEntitiesBeforeSave(
    entities: Partial<UserEntity>[],
    manager: EntityManager,
  ): Promise<void> {
    // TODO: nothing to do
  }

  public async save(
    dto: SaveUserDTO,
    manager: EntityManager | undefined,
  ): Promise<UserEntity> {
    if (!manager) {
      return this.startTransaction((manager) => this.save(dto, manager));
    }

    const candidate = await this.findOneWhere({ login: dto.login }, manager);

    if (candidate) {
      throw new BadRequestException('Login is already taken');
    }

    const user = await this.saveEntity(
      { ...dto, password: hashSync(dto.password, 7) },
      manager,
    );

    await this.inventoryService.save(user, manager);

    await this.accountService.save(user, manager);

    await this.rolesService.addRoleToUser(ERoles.User, user, manager);

    return user;
  }
}
