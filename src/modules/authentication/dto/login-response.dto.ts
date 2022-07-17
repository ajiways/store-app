import { HttpStatus } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export class LoginResponseDTO {
  @Expose()
  @IsString()
  message: string;

  @Expose()
  @IsEnum(HttpStatus)
  status: HttpStatus;

  @IsString()
  @Expose()
  expiration: string;

  @Expose()
  @IsUUID('4')
  userId: string;

  @IsString()
  @Expose()
  token: string;

  @IsString()
  @Expose()
  refreshToken: string;
}
