import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExpenseDto {
    @ApiProperty({ example: 1500.00, description: 'Expense amount' })
    @IsNumber()
    @Min(0.01)
    amount: number;

    @ApiProperty({ example: 'إيجار', description: 'Expense category (e.g., Rent, Utilities)' })
    @IsNotEmpty()
    @IsString()
    category: string;

    @ApiProperty({ example: '2026-09-10', description: 'Date the expense occurred' })
    @IsNotEmpty()
    @IsDateString()
    expense_date: string;

    @ApiPropertyOptional({ example: 'إيجار شهر سبتمبر', description: 'Optional description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 'https://storage.feqqa.app/receipts/123.jpg', description: 'Receipt image URL' })
    @IsOptional()
    @IsString()
    receipt_url?: string;
}