import { forwardRef, Module } from '@nestjs/common';
import { AdministrationModule } from '../administration/administration.module';
import { ItemsModule } from '../items/items.module';
import { PurchaseController } from './controllers/purchase.controller';
import { AccountService } from './services/account.service';
import { PurchaseService } from './services/purchase.service';
import { TransactionService } from './services/transaction.service';

const modules = [forwardRef(() => AdministrationModule), ItemsModule];
const services = [AccountService, PurchaseService, TransactionService];
const controllers = [PurchaseController];

@Module({
  imports: [...modules],
  controllers: [...controllers],
  providers: [...services],
  exports: [...services],
})
export class AccountsModule {}
