import { HttpStatus } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SaveItemResponseDTO {
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
