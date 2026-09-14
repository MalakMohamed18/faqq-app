import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { PurchaseInvoiceItem } from './entities/purchase-invoice-item.entity';
import { PurchaseInvoice } from './entities/purchase-invoice.entity';
import { PurchaseReturn } from './entities/purchase-return.entity';
import { Supplier } from './entities/supplier.entity';
import { PurchaseInvoicesController } from './purchase-invoices.controller';
import { PurchaseInvoicesService } from './purchase-invoices.service';
import { PurchaseReturnsController } from './purchase-returns.controller';
import { PurchaseReturnsService } from './purchase-returns.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Supplier, PurchaseInvoiceItem, PurchaseInvoice, PurchaseReturn]),
        JwtModule
    ],
    controllers: [SuppliersController, PurchaseInvoicesController, PurchaseReturnsController],
    providers: [SuppliersService, PurchaseInvoicesService, PurchaseReturnsService],
    exports: [SuppliersService, PurchaseInvoicesService, PurchaseReturnsService, TypeOrmModule],
})
export class PurchasesModule { }