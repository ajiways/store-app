import { BadRequestException, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ItemController } from './controllers/items.controller';
import { ItemService } from './services/item.service';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import path = require('path');
import { ConfigurationService } from '../../common/configuration/configuration.service';
import { ConfigurationModule } from '../../common/configuration/configuration.module';
import { InventoryItemService } from './services/inventory-item.service';
import { InventoryService } from './services/inventory.service';

const services = [ItemService, InventoryItemService, InventoryService];
const controllers = [ItemController];
const modules = [ConfigurationModule];

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigurationModule],
      useFactory: (configService: ConfigurationService) => ({
        dest: './uploads',
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const fileName: string = v4();

            const extention: string = path.parse(file.originalname).ext;

            callback(null, `${fileName}${extention}`);
          },
        }),
        fileFilter: (_, file, callback) => {
          if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
            callback(
              new BadRequestException(
                'Wrong files, only jpg and jpeg is allowed',
              ),
              false,
            );
          }
          callback(null, true);
        },
        limits: { fileSize: configService.env.MAX_IMAGE_SIZE_KB },
      }),
      inject: [ConfigurationService],
    }),
    ...modules,
  ],
  controllers: [...controllers],
  providers: [...services],
  exports: [...services],
})
export class ItemsModule {}
