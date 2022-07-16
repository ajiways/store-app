import { EntityManager, FindConditions } from 'typeorm';

export interface BaseServiceInterface<T> {
  findWhere(
    conditions: FindConditions<T> | FindConditions<T>[],
    manager?: EntityManager,
  ): Promise<T[]>;

  findByIds(ids: string[]): Promise<T[]>;

  findById(id: string, manager?: EntityManager): Promise<T>;
}
