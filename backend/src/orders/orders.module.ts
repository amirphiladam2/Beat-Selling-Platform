import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports:[StorageModule],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
