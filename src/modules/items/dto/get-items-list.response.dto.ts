import { HttpStatus } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class GetItemListResponseDTO {
  @IsNotEmpty()
  @Expose()
  data: unknown;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsEnum(HttpStatus)
  status: HttpStatus;
}
