import { FindOperator } from 'typeorm';

export const dateTransformer = {
  to(value: unknown): Date | FindOperator<any> | null {
    if (value instanceof FindOperator) {
      return value;
    }
    if (value instanceof Date) {
      return value;
    }
    if (typeof value === 'number' || typeof value === 'string') {
      return new Date(value);
    }
    return null;
  },
  from(value: string | null): Date | null {
    if (value) {
      return new Date(value);
    }
    return null;
  },
};
