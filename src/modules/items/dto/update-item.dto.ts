import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  isDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { EItemType } from '../../../common/enums/item-types.enum';
import { toBoolean } from '../../../common/utils';

type TTransformerValue = { value: string | number };

export class UpdateItemDTO {
  @IsOptional()
  @IsString()
  @Length(5, 32)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(12, 256)
  description?: string;

  @IsOptional()
  @Transform(({ value }: TTransformerValue) => (value ? +value : 0))
  @IsNumber()
  @Min(1)
  price?: number;

  @IsOptional()
  @Transform(({ value }: TTransformerValue) =>
    isDefined(value) ? toBoolean(value) : false,
  )
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  filesToDelete: string[];

  @IsEnum(EItemType)
  type: EItemType;
}
