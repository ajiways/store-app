import { Module } from '@nestjs/common';
import { RolesService } from './services/roles.service';
import { UserRolesService } from './services/user-roles.service';
import { UserService } from './services/user.service';

const services = [UserService, UserRolesService, RolesService];

@Module({
  providers: [...services],
  exports: [...services],
})
export class AdministrationModule {}
