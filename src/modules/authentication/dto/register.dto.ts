import { hashSync } from 'bcrypt';
import { Transform } from 'class-transformer';
import { SaveUserDTO } from '../../administration/dto/save-user.dto';

type TTransformType = { value: string | number };

export class RegisterDTO extends SaveUserDTO {
  @Transform(({ value }: TTransformType) => hashSync(String(value), 7))
  password: string;
}
