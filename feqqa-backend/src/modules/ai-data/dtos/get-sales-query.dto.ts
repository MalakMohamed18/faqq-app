import { IsOptional, IsString, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetSalesQueryDto {
    @ApiPropertyOptional({
        example: '2026-09-01',
        description: 'Start date for sales filtering in YYYY-MM-DD format'
    })
    @IsOptional()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'start_date must be in YYYY-MM-DD format' })
    start_date?: string;

    @ApiPropertyOptional({
        example: '2026-09-12',
        description: 'End date for sales filtering in YYYY-MM-DD format'
    })
    @IsOptional()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'end_date must be in YYYY-MM-DD format' })
    end_date?: string;
}