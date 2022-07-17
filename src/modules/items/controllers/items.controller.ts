import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer';
import { UserRequest } from '../../../common/decorators/user-request';
import { EntityIdDTO } from '../../../common/entity-id.dto';
import { EPermissions } from '../../../common/enums/permissions.enum';
import { UserEntity } from '../../administration/entities/user.entity';
import { RequirePermissions } from '../../authentication/guards/roles.guard';
import { GetInventoryItemsDTO } from '../dto/get-inventory-items.dto';
import { SaveItemDTO } from '../dto/save-item.dto';
import { UpdateItemDTO } from '../dto/update-item.dto';
import { SaveFileExceptionFilter } from '../filters/save-file.exception.filter';
import { MinumumFilesInterceptor } from '../interceptors/minimum-files.intetceptor';
import { InventoryItemServiceInterface } from '../interfaces/inventory-item.service.interface';
import { ItemServiceInterface } from '../interfaces/items.service.interface';
import { InventoryItemService } from '../services/inventory-item.service';
import { ItemService } from '../services/item.service';

@Controller('item')
export class ItemController {
  @Inject(ItemService)
  private readonly itemService: ItemServiceInterface;

  @Inject(InventoryItemService)
  private readonly inventoryItemService: InventoryItemServiceInterface;

  @RequirePermissions([EPermissions['CREATE ITEM']])
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'main', maxCount: 3 },
      { name: 'additional', maxCount: 3 },
    ]),
    MinumumFilesInterceptor,
  )
  @UseFilters(SaveFileExceptionFilter)
  @Post('create')
  async createAndSaveItem(
    @UploadedFiles()
    files: {
      main: Express.Multer.File[];
      additional: Express.Multer.File[];
    },
    @Body() args: SaveItemDTO,
  ) {
    return await this.itemService.save(files, args);
  }

  @RequirePermissions([EPermissions['EDIT ITEM']])
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'main', maxCount: 3 },
      { name: 'additional', maxCount: 3 },
    ]),
    MinumumFilesInterceptor,
  )
  @UseFilters(SaveFileExceptionFilter)
  @Post('edit/:id')
  async updateItem(
    @Param() param: EntityIdDTO,
    @UploadedFiles()
    files: {
      main: Express.Multer.File[];
      additional: Express.Multer.File[];
    },
    @Body() args: UpdateItemDTO,
  ) {
    return await this.itemService.update(files, param.id, args);
  }

  @RequirePermissions([EPermissions['GET ADMIN ITEMS LIST']])
  @Get('/admin/list')
  async getAllItems() {
    return await this.itemService.findWhere({});
  }

  @Get('list')
  async getItemsList(@Query() query: GetInventoryItemsDTO) {
    return await this.itemService.getItemsList(query);
  }

  @Get('/my')
  async getMyItemsList(
    @Query() query: GetInventoryItemsDTO,
    @UserRequest() user: UserEntity,
  ) {
    return await this.inventoryItemService.getInventoryItems(query, user);
  }

  @Get('/:id')
  async getItemInfo(@Param() param: EntityIdDTO) {
    return await this.itemService.getItemInfo(param.id);
  }
}
