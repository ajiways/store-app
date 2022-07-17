import { IsUUID } from 'class-validator';

export class EntityIdDTO {
  @IsUUID('4')
  id: string;
}
