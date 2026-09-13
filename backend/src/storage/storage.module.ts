import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { LocalStorageService } from './storage.service';

@Module({
  providers:[
   {
    provide:'STORAGE_SERVICE',
    useClass:LocalStorageService,
   },
  ],
  exports:['STORAGE_SERVICE'],
  controllers: [StorageController]
})
export class StorageModule {}
