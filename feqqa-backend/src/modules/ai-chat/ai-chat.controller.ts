import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/utils/types';
import { AiChatService } from './ai-chat.service';
import { ChatMessageDto } from './dto/chat-message.dto';

@ApiTags('AI Chat')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('api/ai/chat')
export class AiChatController {
    constructor(private readonly aiChatService: AiChatService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send message to AI assistant and process business data tools' })
    @ApiResponse({ status: 200, description: 'AI response generated successfully' })
    async chat(
        @CurrentUser() business: JWTPayloadType,
        @Body() dto: ChatMessageDto,
    ) {
        return this.aiChatService.processChat(business.sub, dto.message);
    }
}