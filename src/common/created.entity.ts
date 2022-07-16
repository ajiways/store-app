import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CreatedEntity {
  @Column({
    type: 'uuid',
    generated: 'uuid',
    primary: true,
  })
  id: string;

  @CreateDateColumn()
  createdAt: Date;
}

export class EditedEntity extends CreatedEntity {
  @UpdateDateColumn()
  updatedAt: Date;
}

export class DeletedEntity extends EditedEntity {
  @Column({ type: 'date', nullable: false })
  deletedAt: Date;
}
