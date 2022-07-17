import { Transform } from 'class-transformer';
import {
  IsBoolean,
  isDefined,
  IsEnum,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { EItemType } from '../../../common/enums/item-types.enum';
import { Complete } from '../../../common/helpers/dto';
import { toBoolean } from '../../../common/utils';
import { ItemEntity } from '../intities/item.entity';

type TTransformerValue = { value: string | number };

export class SaveItemDTO implements Complete<Omit<ItemEntity, 'images'>> {
  @IsString()
  @Length(5, 32)
  name: string;

  @IsString()
  @Length(12, 256)
  description: string;

  @Transform(({ value }: TTransformerValue) => (value ? +value : 0))
  @IsNumber()
  @Min(1)
  price: number;

  @Transform(({ value }: TTransformerValue) =>
    isDefined(value) ? toBoolean(value) : false,
  )
  @IsBoolean()
  enabled: boolean;

  @IsEnum(EItemType)
  type: EItemType;
}
