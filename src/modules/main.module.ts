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
import { AuthenticationModule } from './authentication/authentication.module';
import { AdministrationModule } from './administration/administration.module';
import { ItemsModule } from './items/items.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';

const modules = [AuthenticationModule, AdministrationModule, ItemsModule];

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
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '../../uploads/'),
    }),
    ...modules,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: IncomingRequestInterceptor },
  ],
})
export class MainModule {}
