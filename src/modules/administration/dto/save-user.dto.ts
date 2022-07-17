import { Complete } from '../../../common/helpers/dto';
import { UserEntity } from '../entities/user.entity';

export class SaveUserDTO implements Complete<UserEntity> {
  displayedName: string;
  login: string;
  password: string;
}
