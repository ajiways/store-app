import { HttpStatus } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

export class LoginResponseDTO {
  @Expose()
  @IsString()
  message: string;

  @Expose()
  @IsEnum(HttpStatus)
  status: HttpStatus;
}
