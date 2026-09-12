import { IsOptional, IsString, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetExpensesQueryDto {
    @ApiPropertyOptional({
        example: '2026-09',
        description: 'Month for expenses filtering in YYYY-MM format'
    })
    @IsOptional()
    @IsString()
    @Matches(/^\d{4}-\d{2}$/, { message: 'month must be in YYYY-MM format' })
    month?: string;
}