import { IsString, Length } from 'class-validator';
import { Complete } from '../../../common/helpers/dto';
import { UserEntity } from '../entities/user.entity';

export class SaveUserDTO implements Complete<UserEntity> {
  @IsString()
  @Length(4, 16)
  displayedName: string;

  @IsString()
  @Length(4, 16)
  login: string;

  @IsString()
  @Length(8, 16)
  password: string;
}
