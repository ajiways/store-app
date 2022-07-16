import { IsNumber, IsString, validateSync } from 'class-validator';
import { registerAs } from '@nestjs/config';
import { plainToClass, Transform } from 'class-transformer';

type TTransformerValue = { value: string | number };

export class EnvironmentConfig {
  @Transform(({ value }: TTransformerValue) => (value ? +value : 3000))
  @IsNumber()
  APP_PORT: number;

  @Transform(({ value }: TTransformerValue) => (value ? +value : 8352))
  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_HOST: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  DB_PASS: string;

  @IsString()
  APP_HOST: string;
}

export default registerAs('env', function (): EnvironmentConfig {
  const validatedConfig = plainToClass(EnvironmentConfig, process.env, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
});
