import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsUUID, ValidateNested } from 'class-validator';

type TTransformerValue = { value: string | number };

export class CreateOfferDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  itemsAndPrices: ItemsAndPricesDTO[];

  @IsUUID('4')
  userToId: string;
}

class ItemsAndPricesDTO {
  @IsUUID('4')
  itemId: string;

  @Transform(({ value }: TTransformerValue) => (value ? +value : 0))
  price: number;
}
