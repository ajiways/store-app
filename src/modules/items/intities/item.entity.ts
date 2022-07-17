import { Column, Entity } from 'typeorm';
import { EditedEntity } from '../../../common/created.entity';
import { EItemType } from '../../../common/enums/item-types.enum';

@Entity('items')
export class ItemEntity extends EditedEntity {
  @Column({ type: 'varchar', length: 32, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 256, nullable: false })
  description: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'varchar', nullable: false, array: true })
  images: string[];

  @Column({ type: 'boolean', nullable: false })
  enabled: boolean;

  @Column({ type: 'enum', enum: EItemType, nullable: false })
  type: EItemType;
}
