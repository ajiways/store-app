import { IsString, Length } from 'class-validator';

export class LoginDTO {
  @IsString()
  @Length(5, 16)
  login: string;

  @IsString()
  @Length(8, 32)
  password: string;
}
