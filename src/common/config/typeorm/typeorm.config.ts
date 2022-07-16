import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DEFAULT_CONNECTION } from '../../typeorm/connections';

const getBaseConfigPart = (): PostgresConnectionOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [join(process.cwd(), '/dist/**/*.entity.js')],
  migrations: ['dist/migrations/*.js', 'dist/seeds/*.js'],
  migrationsTableName: 'migrations',
  namingStrategy: new SnakeNamingStrategy(),
  schema: 'public',
  logging: 'all',
  cli: {
    migrationsDir: 'src/migrations',
  },
});

export default registerAs('typeorm', function (): PostgresConnectionOptions[] {
  return [
    {
      name: DEFAULT_CONNECTION,
      ...getBaseConfigPart(),
    },
    {
      name: 'migrations:create-run-revert',
      ...getBaseConfigPart(),
    },
    {
      name: 'migrations:generate',
      ...getBaseConfigPart(),
    },
    {
      name: 'seeds:create',
      ...getBaseConfigPart(),
      cli: {
        migrationsDir: 'src/seeds',
      },
    },
  ];
});
