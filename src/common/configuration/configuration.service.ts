import { ConfigService } from '@nestjs/config';
import { EnvironmentConfig } from '../config/environment.config';
import { Injectable } from '@nestjs/common';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  private getKey<T>(key: string) {
    const value = this.configService.get<T>(key);
    if (value === undefined)
      throw new Error(`Missing property ${key} in configuration object.`);
    return value;
  }

  get env(): EnvironmentConfig {
    return this.getKey<EnvironmentConfig>('env');
  }

  typeorm(connection: string): PostgresConnectionOptions {
    return this.getKey<PostgresConnectionOptions[]>('typeorm').find(
      (settings: PostgresConnectionOptions) => settings.name === connection,
    )!;
  }
}
