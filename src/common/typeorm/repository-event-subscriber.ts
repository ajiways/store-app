import { EntityManager } from 'typeorm';

export enum ERepositoryEventType {
  ENTITY_SAVED = 'ENTITY_SAVED',
  ENTITY_DELETED = 'ENTITY_DELETED',
}

export type TRepositoryEventPayload<T = any> = {
  type: ERepositoryEventType;
  manager: EntityManager;
  entity: T;
};

export type TRepositoryEventListener = (
  payload: TRepositoryEventPayload,
) => Promise<void>;

export class RepositoryEventSubscriber {
  protected listeners: Record<string, TRepositoryEventListener[]> = {};

  on(name: string, handler: TRepositoryEventListener) {
    this.listeners[name] = this.listeners[name] ?? [];
    this.listeners[name].push(handler);
    return this;
  }

  async emit(
    entityName: string,
    payload: TRepositoryEventPayload,
  ): Promise<void> {
    if (this.listeners[entityName]) {
      for (const listener of this.listeners[entityName]) {
        await listener(payload);
      }
    }
  }
}

export const repositoryEventSubscriber = new RepositoryEventSubscriber();
