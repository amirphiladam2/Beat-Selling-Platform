import {
    Body,
    Controller,
    Post,
    Req,
    Get,
    Param,
    Patch,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';


@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(
        @Req() req: AuthenticatedRequest,
        @Body() createOrderDto: CreateOrderDto,
    ) {
        return this.ordersService.create(
            req.user.id,
            createOrderDto,
        );
    }
    @Get()
    @UseGuards(JwtAuthGuard)
    findMyOrders(@Req() req: AuthenticatedRequest) {
        return this.ordersService.findByUser(req.user.id);
    }

    @Get('purchases')
    @UseGuards(JwtAuthGuard)
    findMyPurchases(@Req() req: AuthenticatedRequest) {
        return this.ordersService.findPurchases(req.user.id);
    }

    @Get('items/:itemId/download')
    @UseGuards(JwtAuthGuard)
    getDownload(
        @Param('itemId', ParseIntPipe) itemId: number,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.ordersService.getDownload(
            itemId,
            req.user.id,
        );
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.ordersService.findOne(id, req.user.id);
    }

    @Patch(':id/pay')
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    markAsPaid(@Param('id', ParseIntPipe) id: number,
        @Body() confirmPaymentDto: ConfirmPaymentDto
    ) {
        return this.ordersService.markAsPaid(id, confirmPaymentDto.paymentReference

        );
    }

    @Patch(':id/cancel')
    @UseGuards(JwtAuthGuard)
    cancel(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.ordersService.cancel(id, req.user.id);
    }

    @Post(':id/checkout')
    @UseGuards(JwtAuthGuard)
    checkout(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.ordersService.checkout(id, req.user.id);
    }

}