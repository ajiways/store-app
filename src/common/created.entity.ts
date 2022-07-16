import { Column, CreateDateColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../modules/administration/entities/user.entity';

export class CreatedEntity {
  @Column({
    type: 'uuid',
    generated: 'uuid',
    primary: true,
  })
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'uuid', nullable: false })
  creatorId: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  private user: UserEntity;
}

export class EditedEntity extends CreatedEntity {
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: false })
  updaterId: string;
}

export class DeletedEntity extends EditedEntity {
  @Column({ type: 'date', nullable: false })
  deletedAt: Date;

  @Column({ type: 'uuid', nullable: false })
  deleterId: string;
}
