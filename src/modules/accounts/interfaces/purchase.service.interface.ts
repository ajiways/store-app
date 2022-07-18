import { EntityManager } from 'typeorm';
import { BaseServiceInterface } from '../../../common/base-service.interface';
import { UserEntity } from '../../administration/entities/user.entity';
import { PurchaseEntity } from '../entities/purchase.entity';

export interface PurchaseServiceInterface
  extends BaseServiceInterface<PurchaseEntity> {
  makePurchase(
    user: UserEntity,
    itemId: string,
    manager?: EntityManager,
  ): Promise<PurchaseEntity>;

  getPurchaseHistory(
    user: UserEntity,
    manager?: EntityManager,
  ): Promise<PurchaseEntity[]>;
}
