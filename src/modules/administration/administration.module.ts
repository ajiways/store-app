import { Module } from '@nestjs/common';
import { ItemsModule } from '../items/items.module';
import { PermissionRolesService } from './services/permission-roles.service';
import { PermissionService } from './services/permission.service';
import { RolesService } from './services/roles.service';
import { UserRolesService } from './services/user-roles.service';
import { UserService } from './services/user.service';

const services = [
  UserService,
  UserRolesService,
  RolesService,
  PermissionService,
  PermissionRolesService,
];

const modules = [ItemsModule];

@Module({
  imports: [...modules],
  providers: [...services],
  exports: [...services],
})
export class AdministrationModule {}
