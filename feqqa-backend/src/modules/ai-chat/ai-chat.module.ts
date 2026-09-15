import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AiChatController } from './ai-chat.controller';
import { AiChatService } from './ai-chat.service';
import { AiDataModule } from '../ai-data/ai-data.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [HttpModule, AiDataModule, JwtModule],
    controllers: [AiChatController],
    providers: [AiChatService],
})
export class AiChatModule { }