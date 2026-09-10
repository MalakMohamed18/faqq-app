import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePlanDto {
    @ApiProperty({ example: 'GROWTH', description: 'Unique code for the plan' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ example: 'باقة النمو', description: 'Plan display name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 599.00, description: 'Price in EGP' })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiPropertyOptional({ example: 30, description: 'Duration in days', default: 30 })
    @IsNumber()
    @IsOptional()
    @Min(1)
    duration_days?: number;

    @ApiPropertyOptional({ example: 10, description: 'Max branches allowed' })
    @IsNumber()
    @IsOptional()
    max_branches?: number;

    @ApiPropertyOptional({ example: 500, description: 'Max invoices allowed per month' })
    @IsNumber()
    @IsOptional()
    max_invoices_per_month?: number;

    @ApiPropertyOptional({ example: true, description: 'Has AI Copilot feature' })
    @IsBoolean()
    @IsOptional()
    has_ai_copilot?: boolean;

    @ApiPropertyOptional({ example: true, description: 'Has demand forecast feature' })
    @IsBoolean()
    @IsOptional()
    has_demand_forecast?: boolean;

    @ApiPropertyOptional({ example: false, description: 'Has dedicated support' })
    @IsBoolean()
    @IsOptional()
    has_dedicated_support?: boolean;

    @ApiPropertyOptional({ example: true, default: true })
    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}