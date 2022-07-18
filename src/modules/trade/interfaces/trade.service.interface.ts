import { EntityManager } from 'typeorm';
import { BaseServiceInterface } from '../../../common/base-service.interface';
import { UserEntity } from '../../administration/entities/user.entity';
import { CreateOfferDTO } from '../dto/create-offer.dto';
import { OfferEntity } from '../entities/offer.entity';

export interface TradeServiceInterface
  extends BaseServiceInterface<OfferEntity> {
  getOffersList(
    user: UserEntity,
    manager?: EntityManager,
  ): Promise<OfferEntity[]>;

  declineOffer(
    id: string,
    user: UserEntity,
    manager?: EntityManager,
  ): Promise<OfferEntity>;

  confirmOffer(
    id: string,
    user: UserEntity,
    manager?: EntityManager,
  ): Promise<OfferEntity>;

  createOffer(
    dto: CreateOfferDTO,
    user: UserEntity,
    manager?: EntityManager,
  ): Promise<OfferEntity>;
}
