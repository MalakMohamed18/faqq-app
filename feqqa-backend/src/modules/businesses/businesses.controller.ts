import { Controller, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BusinessesService } from './businesses.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/utils/types';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('Businesses')
@ApiBearerAuth('JWT-auth')
@Controller('api/businesses')
export class BusinessesController {
    constructor(private readonly businessesService: BusinessesService) { }

    // ~/api/businesses/me
    @Get('me')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Retrieve currently authenticated business details' })
    @ApiResponse({ status: 200, description: 'Business profile retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized (Missing or invalid token)' })
    @ApiResponse({ status: 404, description: 'Business profile not found' })
    async me(@CurrentUser() user: JWTPayloadType) {
        return this.businessesService.findById(user.sub);
    }
}