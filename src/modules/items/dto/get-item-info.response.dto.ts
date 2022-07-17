import { HttpStatus } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';

export class GetItemInfoResponseDTO {
  @IsEnum(HttpStatus)
  @Expose()
  status: HttpStatus;

  @IsString()
  @Expose()
  message: string;

  @IsNotEmpty()
  @Expose()
  data: unknown;
}
