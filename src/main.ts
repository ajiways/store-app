import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigurationService } from './common/configuration/configuration.service';
import { MainModule } from './modules/main.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  app.useGlobalGuards(app.get('AuthenticationGuard'), app.get('RolesGuard'));
  app.enableCors({ credentials: true, origin: '*' });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(cookieParser());

  const config: ConfigurationService = app.get(ConfigurationService);

  await app.listen(Number(config.env.APP_PORT), String(config.env.APP_HOST));
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
