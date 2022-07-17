import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UploadedFiles,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer';
import { EntityIdDTO } from '../../../common/entity-id.dto';
import { EPermissions } from '../../../common/enums/permissions.enum';
import { RequirePermissions } from '../../authentication/guards/roles.guard';
import { SaveItemDTO } from '../dto/save-item.dto';
import { UpdateItemDTO } from '../dto/update-item.dto';
import { SaveFileExceptionFilter } from '../filters/save-file.exception.filter';
import { MinumumFilesInterceptor } from '../interceptors/minimum-files.intetceptor';
import { ItemServiceInterface } from '../interfaces/items.service.interface';
import { ItemService } from '../services/item.service';

@Controller('item')
export class ItemController {
  @Inject(ItemService)
  private readonly itemService: ItemServiceInterface;

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
}
