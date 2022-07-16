import { Module } from '@nestjs/common';
import { AdministrationModule } from '../administration/administration.module';
import { AuthenticationController } from './controllers/authentication.controller';
import { AuthenticationService } from './services/authentication.service';

const controllers = [AuthenticationController];
const services = [AuthenticationService];
const modules = [AdministrationModule];

@Module({
  imports: [...modules],
  controllers: [...controllers],
  providers: [...services],
})
export class AuthenticationModule {}
