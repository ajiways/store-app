import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigurationService } from './common/configuration/configuration.service';
import { MainModule } from './modules/main.module';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config: ConfigurationService = app.get(ConfigurationService);

  await app.listen(Number(config.env.APP_PORT), String(config.env.APP_HOST));
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
