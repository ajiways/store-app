import { BadRequestException, Inject } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';
import { EOfferStatus } from '../../../common/enums/offer-status.enum';
import { AbstractService } from '../../../common/services/abstract.service';
import { AccountService } from '../../accounts/services/account.service';
import { UserEntity } from '../../administration/entities/user.entity';
import { UserService } from '../../administration/services/user.service';
import { InventoryItemService } from '../../items/services/inventory-item.service';
import { InventoryService } from '../../items/services/inventory.service';
import { ItemService } from '../../items/services/item.service';
import { CreateOfferDTO } from '../dto/create-offer.dto';
import { OfferEntity } from '../entities/offer.entity';
import { TradeServiceInterface } from '../interfaces/trade.service.interface';

export class TradeService
  extends AbstractService<OfferEntity>
  implements TradeServiceInterface
{
  @Inject()
  private readonly itemService: ItemService;

  @Inject()
  private readonly inventoryItemService: InventoryItemService;

  @Inject()
  private readonly inventoryService: InventoryService;

  @Inject()
  private readonly userService: UserService;

  @Inject()
  private readonly accountService: AccountService;

  protected Entity = OfferEntity;

  protected async validateEntitiesBeforeSave(
    entities: Partial<OfferEntity>[],
    manager: EntityManager,
  ): Promise<void> {
    //TODO: nothing to do
  }

  public async createOffer(
    dto: CreateOfferDTO,
    user: UserEntity,
    manager: EntityManager | undefined,
  ): Promise<OfferEntity> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.createOffer(dto, user, manager),
      );
    }

    const itemIds = dto.itemsAndPrices.map((item) => item.itemId);
    const userInventory = await this.inventoryService.getUserInventory(
      user,
      manager,
    );

    const itemInInventoryRecords = await this.inventoryItemService.findWhere(
      { inventoryId: userInventory.id, itemId: In(itemIds) },
      manager,
    );

    if (itemIds.length !== itemInInventoryRecords.length) {
      throw new BadRequestException(
        "You trying to trade items that you doesn't have",
      );
    }

    for (const item of itemInInventoryRecords) {
      item.inTrade = true;
    }

    await this.inventoryItemService.saveEntities(
      itemInInventoryRecords,
      manager,
    );

    return await this.saveEntity(
      {
        itemsAndPrices: dto.itemsAndPrices,
        userToId: dto.userToId,
        userFromId: user.id,
      },
      manager,
    );
  }

  public async getOffersList(
    user: UserEntity,
    manager: EntityManager | undefined,
  ): Promise<OfferEntity[]> {
    if (!manager) {
      manager = this.connection.manager;
    }

    return await this.findWhere(
      { userToId: user.id, status: EOfferStatus.WAITING },
      manager,
    );
  }

  public async declineOffer(
    id: string,
    user: UserEntity,
    manager: EntityManager | undefined,
  ): Promise<OfferEntity> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.declineOffer(id, user, manager),
      );
    }

    const offer = await this.findById(id, manager);

    offer.status = EOfferStatus['DECLINED AND CLOSED'];

    await this.updateEntity({ id: offer.id }, offer, manager);

    return offer;
  }

  public async confirmOffer(
    id: string,
    user: UserEntity,
    manager: EntityManager | undefined,
  ): Promise<OfferEntity> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.confirmOffer(id, user, manager),
      );
    }

    const offer = await this.findById(id, manager);
    const userTo = user;
    const userFrom = await this.userService.findById(offer.userFromId, manager);
    const userToInventory = await this.inventoryService.getUserInventory(
      userTo,
      manager,
    );
    const userFromInventory = await this.inventoryService.getUserInventory(
      userFrom,
      manager,
    );

    const inventoryItemsRecordsToBeTraded =
      await this.inventoryItemService.findWhere(
        {
          itemId: In(offer.itemsAndPrices.map((i) => i.itemId)),
          inventoryId: userFromInventory.id,
        },
        manager,
      );

    const finalTradePrice = offer.itemsAndPrices.reduce((acc, cur) => {
      acc += cur.price;
      return acc;
    }, 0);

    for (const item of inventoryItemsRecordsToBeTraded) {
      if (!item.inTrade) {
        throw new BadRequestException(
          'One or more items that uses in this trade was moved out of trade',
        );
      }
    }

    const userToAccount = await this.accountService.getUserAccount(
      userTo,
      manager,
    );
    const userFromAccount = await this.accountService.getUserAccount(
      userFrom,
      manager,
    );

    if (userToAccount.balance < finalTradePrice) {
      throw new BadRequestException(
        "You doesn't have enough currency to confirm the offer",
      );
    }

    userToAccount.balance -= finalTradePrice;
    userFromAccount.balance += finalTradePrice;

    await this.accountService.updateEntity(
      { id: userToAccount.id },
      userToAccount,
      manager,
    );
    await this.accountService.updateEntity(
      { id: userFromAccount.id },
      userFromAccount,
      manager,
    );

    const items = await this.itemService.findByIds(
      inventoryItemsRecordsToBeTraded.map((i) => i.itemId),
    );

    await this.inventoryItemService.deleteEntities(
      inventoryItemsRecordsToBeTraded,
      manager,
    );

    await this.inventoryItemService.addToInventory(
      userToInventory,
      items,
      manager,
    );

    offer.status = EOfferStatus['ACCEPTED AND CLOSED'];

    await this.updateEntity({ id: offer.id }, offer, manager);

    return offer;
  }
}
