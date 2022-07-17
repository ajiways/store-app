import { HttpStatus } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class RegisterResponseDTO {
  @Expose()
  @IsEnum(HttpStatus)
  status: HttpStatus;

  @IsString()
  @Expose()
  message: string;

  @Expose()
  @IsOptional()
  data?: unknown;
}
