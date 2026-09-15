import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AiDataService } from '../ai-data/ai-data.service';
import FormData from 'form-data';
import { UploadsService } from '../uploads/uploads.service';

@Injectable()
export class AiChatService {
    constructor(
        private readonly httpService: HttpService,
        private readonly aiDataService: AiDataService,
        private readonly uploadsService: UploadsService,
    ) { }

    async processChat(businessId: string, message: string) {
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000/api/ai-agent';

        try {
            const initialResponse = await firstValueFrom(
                this.httpService.post(aiServiceUrl, {
                    business_id: businessId,
                    message: message,
                })
            );

            const aiData = initialResponse.data;

            if (aiData.action === 'GET_TODAY_SALES') {
                const salesData = await this.aiDataService.getSalesData(businessId, {});
                return this.sendContextBackToAi(aiServiceUrl, businessId, message, salesData);
            }
            else if (aiData.action === 'GET_LOW_STOCK') {
                const stockData = await this.aiDataService.getLowStock(businessId);
                return this.sendContextBackToAi(aiServiceUrl, businessId, message, stockData);
            }
            else if (aiData.action === 'GET_RECEIVABLES') {
                const debtData = await this.aiDataService.getReceivables(businessId);
                return this.sendContextBackToAi(aiServiceUrl, businessId, message, debtData);
            }
            else if (aiData.action === 'GET_CASHFLOW') {
                const cashFlowData = await this.aiDataService.getCashFlowHistorical(businessId, 30);
                return this.sendContextBackToAi(aiServiceUrl, businessId, message, cashFlowData);
            }

            return aiData;

        } catch (error) {
            throw new InternalServerErrorException(
                `Failed to communicate with AI service: ${error}`
            );
        }
    }

    async processVoiceChat(businessId: string, audioFile: any) {
        if (!audioFile) {
            throw new BadRequestException('ملف الصوت مطلوب');
        }

        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000/api/ai-agent/voice';

        try {
            // 1. استخدام الـ UploadsService بتاعتك لرفع الصوت على Cloudinary في فولدر 'ai-voices'
            const audioUrl = await this.uploadsService.uploadFile(audioFile, 'ai-voices');

            // 2. إرسال رابط الصوت (أو الملف لو البايثون محتاجه) لسيرفر الـ AI
            const response = await firstValueFrom(
                this.httpService.post(aiServiceUrl, {
                    business_id: businessId,
                    audio_url: audioUrl, // بنبعت الرابط بدل البايتات الثقيلة
                })
            );

            const aiData = response.data;

            // 3. دعم الـ Function Calling لو الـ AI طلب داتا من الداتا بيز بعد تحليل الصوت
            if (aiData.action === 'GET_TODAY_SALES') {
                const salesData = await this.aiDataService.getSalesData(businessId, {});
                return this.sendVoiceContextBackToAi(aiServiceUrl, businessId, salesData);
            }
            else if (aiData.action === 'GET_LOW_STOCK') {
                const stockData = await this.aiDataService.getLowStock(businessId);
                return this.sendVoiceContextBackToAi(aiServiceUrl, businessId, stockData);
            }

            return aiData;

        } catch (error) {
            throw new InternalServerErrorException(
                `Failed to process voice message: ${error}`
            );
        }
    }

    async processImageChat(businessId: string, imageFile: any, message?: string) {
        if (!imageFile) {
            throw new BadRequestException('الصورة مطلوبة');
        }

        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000/api/ai-agent/image';

        try {
            const imageUrl = await this.uploadsService.uploadFile(imageFile, 'ai-chat-images');

            const response = await firstValueFrom(
                this.httpService.post(aiServiceUrl, {
                    business_id: businessId,
                    image_url: imageUrl,
                    message: message || 'تحليل هذه الصورة',
                })
            );

            const aiData = response.data;

            if (aiData.action === 'GET_TODAY_SALES') {
                const salesData = await this.aiDataService.getSalesData(businessId, {});
                return this.sendImageContextBackToAi(aiServiceUrl, businessId, salesData);
            }
            else if (aiData.action === 'GET_LOW_STOCK') {
                const stockData = await this.aiDataService.getLowStock(businessId);
                return this.sendImageContextBackToAi(aiServiceUrl, businessId, stockData);
            }

            return aiData;

        } catch (error) {
            throw new InternalServerErrorException(
                `Failed to process image with AI: ${error}`
            );
        }
    }

    private async sendContextBackToAi(aiUrl: string, businessId: string, originalMessage: string, contextData: any) {
        const analysisResponse = await firstValueFrom(
            this.httpService.post(`${aiUrl}/analyze`, {
                business_id: businessId,
                original_message: originalMessage,
                context_data: contextData,
            })
        );
        return analysisResponse;
    }

    private async sendVoiceContextBackToAi(aiUrl: string, businessId: string, contextData: any) {
        const analysisResponse = await firstValueFrom(
            this.httpService.post(`${aiUrl}/analyze`, {
                business_id: businessId,
                context_data: contextData,
            })
        );
        return analysisResponse.data;
    }

    private async sendImageContextBackToAi(aiUrl: string, businessId: string, contextData: any) {
        const analysisResponse = await firstValueFrom(
            this.httpService.post(`${aiUrl}/analyze`, {
                business_id: businessId,
                context_data: contextData,
            })
        );
        return analysisResponse.data;
    }

}