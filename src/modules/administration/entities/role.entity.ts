import { Column, Entity } from 'typeorm';
import { CreatedEntity } from '../../../common/created.entity';

@Entity('roles')
export class RoleEntity extends CreatedEntity {
  @Column({ type: 'varchar', length: 32, nullable: false })
  name: string;
}
