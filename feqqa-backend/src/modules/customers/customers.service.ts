import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepo: Repository<Customer>,
    ) { }

    /**
     * Create a new customer for the authenticated business
     */
    async createCustomer(businessId: string, dto: CreateCustomerDto) {
        const customer = this.customerRepo.create({
            ...dto,
            business: { id: businessId },
        });
        return this.customerRepo.save(customer);
    }

    /**
     * Get all customers for the authenticated business
     */
    async getCustomers(businessId: string) {
        return this.customerRepo.find({
            where: { business: { id: businessId } },
            order: { created_at: 'DESC' },
        });
    }

    /**
     * Get customers with outstanding debts (Receivables) for AI and mobile app
     */
    async getReceivables(businessId: string) {
        const customers = await this.customerRepo
            .createQueryBuilder('customer')
            .where('customer.business_id = :businessId', { businessId })
            .andWhere('customer.total_debt > 0')
            .orderBy('customer.total_debt', 'DESC')
            .getMany();

        return {
            customers: customers.map((c) => ({
                id: c.id,
                customer_name: c.name,
                phone: c.phone,
                amount: Number(c.total_debt),
                currency: 'EGP',
            })),
        };
    }

    /**
     * Get customer details along with their sales history
     */
    async getCustomerById(id: string) {
        const customer = await this.customerRepo.findOne({
            where: { id },
            relations: {
                sales: true
            },
        });

        if (!customer) {
            throw new NotFoundException(`Customer with ID ${id} not found.`);
        }

        return customer;
    }
}