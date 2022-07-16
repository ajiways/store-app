import { EntityManager } from 'typeorm';
import { BaseServiceInterface } from '../../../common/base-service.interface';
import { SaveUserDTO } from '../dto/save-user.dto';
import { UserEntity } from '../entities/user.entity';

export interface UserServiceInterface extends BaseServiceInterface<UserEntity> {
  save(dto: SaveUserDTO, manager?: EntityManager): Promise<UserEntity>;
}
