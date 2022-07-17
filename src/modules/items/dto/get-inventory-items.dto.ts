import { Transform } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

type TTransformerType = { value: string | number };

export class GetInventoryItemsDTO {
  @Transform(({ value }: TTransformerType) => (value ? +value : 0))
  @IsNumber()
  @Min(1)
  take: number;

  @Transform(({ value }: TTransformerType) => (value ? +value : 0))
  @IsNumber()
  @Min(0)
  skip: number;
}
