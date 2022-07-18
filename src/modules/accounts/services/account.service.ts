import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { AbstractService } from '../../../common/services/abstract.service';
import { UserEntity } from '../../administration/entities/user.entity';
import { AccountEntity } from '../entities/account.entity';
import { AccountServiceInterface } from '../interfaces/account.service.interface';

export class AccountService
  extends AbstractService<AccountEntity>
  implements AccountServiceInterface
{
  protected Entity = AccountEntity;

  protected async validateEntitiesBeforeSave(
    entities: Partial<AccountEntity>[],
    manager: EntityManager,
  ): Promise<void> {
    //TODO: nothing to do
  }

  public async save(
    user: UserEntity,
    manager: EntityManager | undefined,
  ): Promise<boolean> {
    if (!manager) {
      return this.startTransaction((manager) => this.save(user, manager));
    }

    const candidate = await this.findOneWhere({ userId: user.id }, manager);

    if (!candidate) {
      await this.saveEntity({ userId: user.id, balance: 0 }, manager);

      return true;
    } else {
      throw new BadRequestException('User cannot have more than one account');
    }
  }

  public async getUserAccount(
    user: UserEntity,
    manager: EntityManager | undefined,
  ): Promise<AccountEntity> {
    if (!manager) {
      manager = this.connection.manager;
    }

    const account = await this.findOneWhere({ userId: user.id }, manager);

    if (!account) {
      throw new InternalServerErrorException(
        "This user doesn't have an account, please, contact the system administrator",
      );
    }

    return account;
  }
}
