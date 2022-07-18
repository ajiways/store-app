import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { AdministrationModule } from '../administration/administration.module';
import { ItemsModule } from '../items/items.module';
import { TradeController } from './controllers/trade.controller';
import { TradeService } from './services/trade.service';

const modules = [AdministrationModule, ItemsModule, AccountsModule];
const controllers = [TradeController];
const services = [TradeService];

@Module({
  imports: [...modules],
  controllers: [...controllers],
  providers: [...services],
})
export class TradeModule {}
