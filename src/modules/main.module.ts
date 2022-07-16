import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeORMConfig from '../common/config/typeorm/typeorm.config';
import EnvConfig from '../common/config/environment.config';
import { ConfigurationModule } from '../common/configuration/configuration.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { IncomingRequestInterceptor } from '../common/interceptors/incoming-request.interceptor';
import { DEFAULT_CONNECTION } from '../common/typeorm/connections';
import { ConfigurationService } from '../common/configuration/configuration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfig, typeORMConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: async (config: ConfigurationService) =>
        config.typeorm(DEFAULT_CONNECTION),
      inject: [ConfigurationService],
    }),
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: IncomingRequestInterceptor },
  ],
})
export class MainModule {}
