import { EntityManager } from 'typeorm';
import { BaseServiceInterface } from '../../../common/base-service.interface';
import { UserEntity } from '../../administration/entities/user.entity';
import { AccountEntity } from '../entities/account.entity';

export interface AccountServiceInterface
  extends BaseServiceInterface<AccountEntity> {
  save(user: UserEntity, manager?: EntityManager): Promise<boolean>;

  getUserAccount(
    user: UserEntity,
    manager?: EntityManager,
  ): Promise<AccountEntity>;
}
