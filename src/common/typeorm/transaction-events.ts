import * as EventEmitter from 'events';
import { EntityManager, QueryRunner } from 'typeorm';

export const TRANSACTION_END_EVENT = 'TRANSACTION_END_EVENT';

export type QueryRunnerWithTransactionEvents = QueryRunner & {
  data?: {
    transactionEvents?: EventEmitter;
  };
};

export type EntityManagerWithTransactionEvents = EntityManager & {
  queryRunner?: QueryRunnerWithTransactionEvents;
};
