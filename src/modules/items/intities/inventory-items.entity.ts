import { Column, Entity, ManyToOne } from 'typeorm';
import { EditedEntity } from '../../../common/created.entity';
import { InventoryEntity } from './inventory.entity';
import { ItemEntity } from './item.entity';

@Entity('inventory_items')
export class InventoryItemsEntity extends EditedEntity {
  @Column({ type: 'uuid', nullable: false })
  inventoryId: string;

  @Column({ type: 'uuid', nullable: false })
  itemId: string;

  @ManyToOne(() => InventoryEntity, { nullable: false })
  private inventory: InventoryEntity;

  @ManyToOne(() => ItemEntity, { nullable: false })
  private item: ItemEntity;
}
