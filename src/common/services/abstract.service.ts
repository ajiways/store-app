/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Connection,
  EntityManager,
  FindConditions,
  FindOneOptions,
  In,
  IsNull,
} from 'typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { RepositoryFactory } from '../typeorm/repository-factory';
import { keyBy, difference } from 'lodash';
import * as EventEmitter from 'events';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import {
  EntityManagerWithTransactionEvents,
  QueryRunnerWithTransactionEvents,
  TRANSACTION_END_EVENT,
} from '../typeorm/transaction-events';

export type TEntityPrototype = Record<string, any> & {
  id?: string;
  createdAt?: Date | null;
};

export type TFindExtraParams<T> = {
  ignoreDeleted?: boolean;
  order?: FindOneOptions<T>['order'];
  take?: number;
  skip?: number;
};

const chunk = 500;

export abstract class AbstractService<T extends TEntityPrototype> {
  @Inject()
  protected connection: Connection;

  protected abstract Entity: {
    new (): T;
    prototype: Record<any, any>;
  };

  protected createdAtColumnName: string | null = 'createdAt';

  protected editedAtColumnName: string | null = 'editedAt';

  protected deletedAtColumnName: string | null = null;

  protected abstract validateEntitiesBeforeSave(
    entities: Partial<T>[],
    manager: EntityManager,
  ): Promise<void>;

  async saveEntity(input: Partial<T>, manager: EntityManager): Promise<T> {
    const [entity] = await this.saveEntities([input], manager);
    return entity;
  }

  protected async beforeSave(
    entities: Partial<T>[],
    manager: EntityManager,
    existingEntities: T[],
  ): Promise<Partial<T>[]> {
    return entities;
  }

  protected async afterSave(
    entities: Partial<T>[],
    manager: EntityManager,
  ): Promise<void> {
    //
  }

  protected async mergeEntitiesBeforeSave(
    input: Partial<T>[],
    existingEntities: T[],
    manager: EntityManager,
  ) {
    const existingEntitiesById = keyBy(existingEntities, 'id');
    return input.map((i) => {
      if (i.id) {
        return {
          ...existingEntitiesById[i.id!],
          ...i,
        };
      }
      // FIXME: temporary
      // if (this.authorIdColumnName && !params.authorId) {
      //   throw new Error('authorId parameter is required');
      // }
      return {
        ...i,
        ...(this.createdAtColumnName
          ? { [this.createdAtColumnName]: new Date() }
          : {}),
        ...(this.editedAtColumnName
          ? { [this.editedAtColumnName]: new Date() }
          : {}),
      };
    });
  }

  async updateEntity(
    where: FindConditions<T>,
    input: Partial<T>,
    manager: EntityManager,
  ): Promise<void> {
    const repository = RepositoryFactory(manager, this.Entity);
    await repository.update(where, input);
  }

  protected async getExitingEntities(
    input: Partial<T>[],
    manager: EntityManager,
  ) {
    const ids = input.filter((i) => i.id).map((i) => i.id!);
    if (ids.length) {
      const uniqueIds = [...new Set(ids)];
      const existing = await this.findWhere({ id: In(uniqueIds) }, manager);
      const existingIds = existing.map((i) => i.id);
      const invalidIds = difference(ids, existingIds);
      if (invalidIds.length) {
        throw new Error(
          `One or more entities does not exist (${this.Entity.name})`,
        );
      }
      return existing;
    }
    return [];
  }

  async saveEntities(
    input: Partial<T>[],
    manager: EntityManager,
  ): Promise<T[]> {
    const repository = this.getRepository(manager);
    const existingEntities = await this.getExitingEntities(input, manager);
    const entities = await this.mergeEntitiesBeforeSave(
      input,
      existingEntities,
      manager,
    );
    const modifiedEntities = await this.beforeSave(
      entities,
      manager,
      existingEntities,
    );
    await this.validateEntitiesBeforeSave(modifiedEntities, manager);
    const savedEntities = await repository.save(modifiedEntities, {
      chunk,
    });
    await this.afterSave(savedEntities, manager);
    const ids = savedEntities.map((i) => i.id);
    return repository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async findById(id: string, manager: EntityManager | undefined): Promise<T> {
    if (!manager) {
      manager = this.connection.manager;
    }

    const entity = await this.findOneWhere({ id }, manager);

    if (!entity) {
      throw new NotFoundException(
        `Entity ${this.Entity.name} with id ${id} was not found`,
      );
    }

    return entity;
  }

  async findByIds(
    ids: string[],
    manager?: EntityManager | undefined,
  ): Promise<T[]> {
    if (!ids.length) {
      return [];
    }

    const uniqueIds = [...new Set(ids)];
    if (!manager) {
      manager = this.connection.manager;
    }

    const results = await this.findWhere({ id: In(uniqueIds) }, manager);

    const diff = difference(
      uniqueIds,
      results.map((e) => e.id!),
    );

    if (diff.length) {
      throw new NotFoundException(
        `One or more entities does not exist (${this.Entity.name})`,
      );
    }

    return results;
  }

  async findWhere(
    conditions: FindConditions<T> | FindConditions<T>[],
    manager: EntityManager | undefined,
    extra: TFindExtraParams<T> = {},
  ) {
    const { where, order, take, skip } = this.findWhereParams(
      conditions,
      extra,
    );

    return this.getRepository(manager).find({
      where,
      order,
      take,
      skip,
    });
  }

  async findWhereAndCount(
    conditions: FindConditions<T> | FindConditions<T>[],
    manager: EntityManager | undefined,
    extra: TFindExtraParams<T> = {},
  ) {
    const { where, order, take, skip } = this.findWhereParams(
      conditions,
      extra,
    );

    return this.getRepository(manager).findAndCount({
      where,
      order,
      take,
      skip,
    });
  }

  async findOneWhere(
    where: FindConditions<T> | FindConditions<T>[],
    manager: EntityManager | undefined,
    extra: TFindExtraParams<T> = {},
  ) {
    const entities = await this.findWhere(where, manager, {
      ...extra,
      take: 1,
    });
    return entities.pop();
  }

  async findOneOrFail(
    where: FindConditions<T>,
    manager: EntityManager,
    extra: TFindExtraParams<T> = {},
  ) {
    const entity = await this.findOneWhere(where, manager, extra);

    if (!entity) {
      throw new Error('Entity not found');
    }

    return entity;
  }

  protected findWhereParams(
    conditions: FindConditions<T> | FindConditions<T>[],
    extra: TFindExtraParams<T> = {},
  ) {
    const { ignoreDeleted, order, take, skip } = extra;

    const where: Record<string, unknown>[] = Array.isArray(conditions)
      ? conditions
      : [conditions];

    for (const clause of where) {
      if (!ignoreDeleted && this.deletedAtColumnName) {
        clause[this.deletedAtColumnName] = IsNull();
      }
    }

    return {
      where,
      order,
      take,
      skip,
    };
  }

  async deleteEntities(
    where: FindConditions<T> | FindConditions<T>[],
    manager: EntityManager,
  ) {
    if (!manager.queryRunner?.isTransactionActive) {
      throw new Error('Transaction not started');
    }

    const deletedAtColumnName: keyof T | null = this.deletedAtColumnName;
    const entityRepo = this.getRepository(manager);

    const entities = await entityRepo.find({ where, withDeleted: true });

    if (!entities.length) {
      return true;
    }

    if (deletedAtColumnName) {
      const alreadyDeleted = entities.find((e) => e[deletedAtColumnName]);

      if (alreadyDeleted) {
        throw new Error(`Entity ${alreadyDeleted.id} already deleted`);
      }
    }

    await this.beforeDelete(entities, manager);

    if (deletedAtColumnName) {
      const partialEntity = {
        [deletedAtColumnName]: new Date(),
      };

      await entityRepo.update(
        {
          id: In(entities.map(({ id }) => id)),
        },
        // type-coverage:ignore-next-line
        partialEntity as unknown as QueryDeepPartialEntity<T>,
      );
    } else {
      await entityRepo.delete({ id: In(entities.map(({ id }) => id)) });
    }
    await this.afterDelete(entities, manager);

    return true;
  }

  protected async beforeDelete(entities: T[], manager: EntityManager) {
    //
  }

  protected async afterDelete(entities: T[], manager: EntityManager) {
    //
  }

  protected async startTransaction<T>(
    runInTransaction: (entityManager: EntityManager) => Promise<T>,
    manager?: EntityManager,
  ): Promise<T> {
    manager = manager || this.connection.manager;

    if (manager.queryRunner?.isTransactionActive) {
      return runInTransaction(manager);
    }

    let queryRunner: QueryRunnerWithTransactionEvents | undefined;

    const result = await manager.transaction(
      async (entityManager: EntityManagerWithTransactionEvents) => {
        try {
          queryRunner = entityManager.queryRunner;
          if (queryRunner) {
            if (!queryRunner.data) {
              queryRunner.data = {};
            }
            queryRunner.data.transactionEvents = new EventEmitter();
          }

          return runInTransaction(entityManager);
        } catch (error) {
          if (queryRunner && queryRunner.data.transactionEvents) {
            queryRunner.data.transactionEvents.removeAllListeners(
              TRANSACTION_END_EVENT,
            );
          }
          throw error;
        }
      },
    );

    if (queryRunner && queryRunner.data.transactionEvents) {
      queryRunner.data.transactionEvents.emit(TRANSACTION_END_EVENT);
    }

    return result;
  }

  getRepository(manager: EntityManager | undefined) {
    manager = manager || this.connection.manager;
    return RepositoryFactory(manager, this.Entity);
  }
}
