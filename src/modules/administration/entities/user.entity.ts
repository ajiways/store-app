import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn({ generated: 'uuid', primary: true, type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 16, nullable: false })
  displayedName: string;

  @Column({ type: 'varchar', length: 16, nullable: false, unique: true })
  login: string;

  @Column({ type: 'varchar', length: 256, nullable: false })
  password: string;
}
