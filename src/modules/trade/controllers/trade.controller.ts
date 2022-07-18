import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { UserRequest } from '../../../common/decorators/user-request';
import { EntityIdDTO } from '../../../common/entity-id.dto';
import { EPermissions } from '../../../common/enums/permissions.enum';
import { UserEntity } from '../../administration/entities/user.entity';
import { RequirePermissions } from '../../authentication/guards/roles.guard';
import { CreateOfferDTO } from '../dto/create-offer.dto';
import { TradeServiceInterface } from '../interfaces/trade.service.interface';
import { TradeService } from '../services/trade.service';

@Controller('trade')
export class TradeController {
  @Inject(TradeService)
  private readonly tradeService: TradeServiceInterface;

  @RequirePermissions([EPermissions['CAN TRADE']])
  @Post('/offer/create')
  async createOffer(
    @Body() args: CreateOfferDTO,
    @UserRequest() user: UserEntity,
  ) {
    return await this.tradeService.createOffer(args, user);
  }

  @RequirePermissions([EPermissions['CAN TRADE']])
  @Get('/offer/accept/:id')
  async confirmOffer(
    @Param() params: EntityIdDTO,
    @UserRequest() user: UserEntity,
  ) {
    return await this.tradeService.confirmOffer(params.id, user);
  }

  @RequirePermissions([EPermissions['CAN TRADE']])
  @Get('/offer/decline/:id')
  async declineOffer(
    @Param() params: EntityIdDTO,
    @UserRequest() user: UserEntity,
  ) {
    return await this.tradeService.declineOffer(params.id, user);
  }

  @RequirePermissions([EPermissions['CAN TRADE']])
  @Get('/offer/list')
  async getOfferList(@UserRequest() user: UserEntity) {
    return await this.tradeService.getOffersList(user);
  }
}
