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

  //TODO: Добавить когда юзера сделаю
  // @Column({ type: 'uuid', nullable: false })
  // creatorId: string;

  //  @ManyToOne(() => UserEntity, nullable: false)
  //  private user: UserEntity;
}

export class EditedEntity extends CreatedEntity {
  @UpdateDateColumn()
  updatedAt: Date;

  //TODO: Добавить когда юзера сделаю
  // @Column({ type: 'uuid', nullable: false})
  // updaterId: string;

  //  @ManyToOne(() => UserEntity, nullable: false)
  //  private user: UserEntity;
}

export class DeletedEntity extends EditedEntity {
  @Column({ type: 'date', nullable: false })
  deletedAt: Date;

  //TODO: Добавить когда юзера сделаю
  // @Column({ type: 'uuid', nullable: false})
  // deleterId: string;

  //  @ManyToOne(() => UserEntity, nullable: false)
  //  private user: UserEntity;
}
