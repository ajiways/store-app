import { IsString, Length } from 'class-validator';
import { SaveUserDTO } from '../../administration/dto/save-user.dto';

export class RegisterDTO implements SaveUserDTO {
  @IsString()
  @Length(8, 32)
  password: string;

  @IsString()
  @Length(5, 16)
  displayedName: string;

  @IsString()
  @Length(5, 16)
  login: string;
}
