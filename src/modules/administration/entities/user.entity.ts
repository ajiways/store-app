import { Column, Entity } from 'typeorm';
import { EditedEntity } from '../../../common/created.entity';

@Entity('users')
export class UserEntity extends EditedEntity {
  @Column({ type: 'varchar', length: 16, nullable: false })
  displayedName: string;

  @Column({ type: 'varchar', length: 16, nullable: false, unique: true })
  login: string;

  @Column({ type: 'varchar', length: 256, nullable: false })
  password: string;
}
