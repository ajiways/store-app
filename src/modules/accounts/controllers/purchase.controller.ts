import { Controller, Get, Inject, Param } from '@nestjs/common';
import { UserRequest } from '../../../common/decorators/user-request';
import { EntityIdDTO } from '../../../common/entity-id.dto';
import { EPermissions } from '../../../common/enums/permissions.enum';
import { UserEntity } from '../../administration/entities/user.entity';
import { RequirePermissions } from '../../authentication/guards/roles.guard';
import { PurchaseServiceInterface } from '../interfaces/purchase.service.interface';
import { PurchaseService } from '../services/purchase.service';

@Controller('purchase')
export class PurchaseController {
  @Inject(PurchaseService)
  private readonly purchaseService: PurchaseServiceInterface;

  @RequirePermissions([EPermissions['GET HISTORY OF PURCHASES']])
  @Get('/history')
  async getPurchaseHistory(@UserRequest() user: UserEntity) {
    return await this.purchaseService.getPurchaseHistory(user);
  }

  @RequirePermissions([EPermissions['MAKE PURCHASE']])
  @Get('/buy/:id')
  async makePurchase(
    @Param() params: EntityIdDTO,
    @UserRequest() user: UserEntity,
  ) {
    return await this.purchaseService.makePurchase(user, params.id);
  }
}
