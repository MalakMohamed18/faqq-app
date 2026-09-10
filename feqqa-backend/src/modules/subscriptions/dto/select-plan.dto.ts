import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class SelectPlanDto {
    @ApiProperty({ example: 'a1b2c3d4-0000-0000-0000-123456789abc', description: 'ID of the selected plan' })
    @IsUUID()
    @IsNotEmpty()
    planId: string;
}