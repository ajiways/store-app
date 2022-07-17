import { hashSync } from 'bcrypt';
import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';
import { SaveUserDTO } from '../../administration/dto/save-user.dto';

type TTransformType = { value: string | number };

export class RegisterDTO implements SaveUserDTO {
  @IsString()
  @Length(8, 32)
  @Transform(({ value }: TTransformType) => hashSync(String(value), 7))
  password: string;

  @IsString()
  @Length(5, 16)
  displayedName: string;

  @IsString()
  @Length(5, 16)
  login: string;
}
