import { Column, Entity } from 'typeorm';
import { CreatedEntity } from '../../../common/created.entity';
import { EPermissions } from '../../../common/enums/permissions.enum';

@Entity('permissions')
export class PermissionEntity extends CreatedEntity {
  @Column({ type: 'varchar', length: 32, nullable: false })
  name: string;

  @Column({ type: 'enum', enum: EPermissions, nullable: false })
  permission: EPermissions;
}
