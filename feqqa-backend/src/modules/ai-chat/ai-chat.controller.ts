import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
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

    @Post('voice')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('audio'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Send voice message to AI assistant (Voice-to-Text & Processing)' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                audio: {
                    type: 'string',
                    format: 'binary',
                    description: 'ملف الصوتي المسجل (mp3, wav, m4a)',
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Voice processed and AI response generated successfully' })
    async chatWithVoice(
        @CurrentUser() business: JWTPayloadType,
        @UploadedFile() audioFile: any,
    ) {
        return this.aiChatService.processVoiceChat(business.sub, audioFile);
    }

    @Post('image')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Send image (e.g. invoice or product) with optional prompt to AI assistant' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                    description: 'صورة الفاتورة أو المنتج (png, jpg, jpeg)',
                },
                message: {
                    type: 'string',
                    description: 'رسالة أو سؤال مرفق مع الصورة (اختياري)',
                    example: 'سجل الفاتورة دي في المشتريات',
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Image processed and AI response generated successfully' })
    async chatWithImage(
        @CurrentUser() business: JWTPayloadType,
        @UploadedFile() imageFile: any,
        @Body('message') message?: string,
    ) {
        return this.aiChatService.processImageChat(business.sub, imageFile, message);
    }
}