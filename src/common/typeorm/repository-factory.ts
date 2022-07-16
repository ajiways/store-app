import {
  EntityManager,
  ObjectType,
  EntityRepository,
  RemoveOptions,
  FindConditions,
  DeleteResult,
  DeepPartial,
  In,
  InsertResult,
  Repository,
  SaveOptions,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import {
  ERepositoryEventType,
  repositoryEventSubscriber,
} from './repository-event-subscriber';

export class CustomRepository<
  Entity extends { id?: string },
> extends Repository<Entity> {
  protected async notify(
    event: ERepositoryEventType,
    entity: Entity | Entity[],
  ) {
    const entities = Array.isArray(entity) ? entity : [entity];
    for (const item of entities) {
      const target: string =
        typeof this.target === 'string' ? this.target : this.target.name;
      await repositoryEventSubscriber.emit(target, {
        type: event,
        entity: item,
        manager: this.manager,
      });
    }
  }

  save<T extends DeepPartial<Entity>>(
    entities: T[],
    options: SaveOptions & { reload: false },
  ): Promise<T[]>;

  save<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SaveOptions,
  ): Promise<(T & Entity)[]>;

  save<T extends DeepPartial<Entity>>(
    entity: T,
    options: SaveOptions & { reload: false },
  ): Promise<T>;

  save<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions,
  ): Promise<T & Entity>;

  async save<T extends DeepPartial<Entity>>(
    entityOrEntities: T | T[],
    options?: SaveOptions,
  ): Promise<T | T[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await super.save(entityOrEntities, options);
    const entities = await this.findByIds(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (Array.isArray(result) ? result : [result]).map((i) => i.id!),
    );
    await this.notify(ERepositoryEventType.ENTITY_SAVED, entities);
    return result;
  }

  async insert(
    entity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[],
  ): Promise<InsertResult> {
    const result: {
      raw: { id: string }[];
      generatedMaps: Record<any, any>[];
      identifiers: Record<any, any>[];
    } = await super.insert(entity);
    const ids = result.raw.map((i: { id: string }) => i.id);
    const entities = await this.findByIds(ids);
    await this.notify(ERepositoryEventType.ENTITY_SAVED, entities);
    return result;
  }

  async update(
    criteria: FindConditions<Entity>,
    partialEntity: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult> {
    const entitiesBeforeSave = await this.find({
      where: criteria,
    });
    const ids = entitiesBeforeSave.map((e) => e.id);

    const result = await super.update(criteria, partialEntity);

    if (ids.length) {
      const entities = await this.find({
        where: { id: In(ids) },
      });
      if (entities.length) {
        await this.notify(ERepositoryEventType.ENTITY_SAVED, entities);
      }
    }
    return result;
  }

  async delete(criteria: FindConditions<Entity>): Promise<DeleteResult> {
    const entities = await this.find({
      where: criteria,
    });

    const result = await super.delete(criteria);

    if (entities.length) {
      await this.notify(ERepositoryEventType.ENTITY_DELETED, entities);
    }

    return result;
  }

  remove(entities: Entity[], options?: RemoveOptions): Promise<Entity[]>;

  remove(entity: Entity, options?: RemoveOptions): Promise<Entity>;

  async remove(
    entityOrEntities: Entity | Entity[],
    options?: RemoveOptions,
  ): Promise<Entity | Entity[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await super.remove(entityOrEntities, options);

    await this.notify(ERepositoryEventType.ENTITY_DELETED, entityOrEntities);

    return result;
  }
}

export function RepositoryFactory<Entity>(
  manager: EntityManager,
  entity: ObjectType<Entity>,
): CustomRepository<Entity> {
  const MyClass = class extends CustomRepository<Entity> {};
  EntityRepository(entity)(MyClass);

  return manager.getCustomRepository(MyClass);
}
