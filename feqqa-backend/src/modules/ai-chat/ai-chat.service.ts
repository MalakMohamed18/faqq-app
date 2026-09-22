import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AiDataService } from '../ai-data/ai-data.service';
import { UploadsService } from '../uploads/uploads.service';

@Injectable()
export class AiChatService {
    private readonly baseUrl = (process.env.AI_SERVICE_URL).replace(/\/$/, '');

    constructor(
        private readonly httpService: HttpService,
        private readonly aiDataService: AiDataService,
        private readonly uploadsService: UploadsService,
    ) { }

    async processChat(businessId: string, message: string, token?: string) {
        const endpoint = `${this.baseUrl}/ai/chat`;
        const headers = token ? { Authorization: token } : {};

        try {
            const initialResponse = await firstValueFrom(
                this.httpService.post(
                    endpoint,
                    {
                        business_id: businessId,
                        message: message,
                    },
                    { headers }
                )
            );

            const aiData = initialResponse.data;

            if (aiData.action === 'GET_TODAY_SALES') {
                const salesData = await this.aiDataService.getSalesData(businessId, {});
                return this.sendContextBackToAi(businessId, message, salesData, headers);
            }
            else if (aiData.action === 'GET_LOW_STOCK') {
                const stockData = await this.aiDataService.getLowStock(businessId);
                return this.sendContextBackToAi(businessId, message, stockData, headers);
            }
            else if (aiData.action === 'GET_RECEIVABLES') {
                const debtData = await this.aiDataService.getReceivables(businessId);
                return this.sendContextBackToAi(businessId, message, debtData, headers);
            }
            else if (aiData.action === 'GET_CASHFLOW') {
                const cashFlowData = await this.aiDataService.getCashFlowHistorical(businessId, 30);
                return this.sendContextBackToAi(businessId, message, cashFlowData, headers);
            }

            return aiData;

        } catch (error) {
            throw new InternalServerErrorException(
                `Failed to communicate with AI service: ${error}`
            );
        }
    }

    async processVoiceChat(businessId: string, audioFile: any, token?: string) {
        if (!audioFile) {
            throw new BadRequestException('ملف الصوت مطلوب');
        }

        const endpoint = `${this.baseUrl}/ai/voice`;
        const headers = token ? { Authorization: token } : {};

        try {
            const audioUrl = await this.uploadsService.uploadFile(audioFile, 'ai-voices');

            const response = await firstValueFrom(
                this.httpService.post(
                    endpoint,
                    {
                        business_id: businessId,
                        audio_url: audioUrl,
                    },
                    { headers }
                )
            );

            const aiData = response.data;

            if (aiData.action === 'GET_TODAY_SALES') {
                const salesData = await this.aiDataService.getSalesData(businessId, {});
                return this.sendVoiceContextBackToAi(businessId, salesData, headers);
            }
            else if (aiData.action === 'GET_LOW_STOCK') {
                const stockData = await this.aiDataService.getLowStock(businessId);
                return this.sendVoiceContextBackToAi(businessId, stockData, headers);
            }

            return aiData;

        } catch (error) {
            throw new InternalServerErrorException(
                `Failed to process voice message: ${error}`
            );
        }
    }

    async processImageChat(businessId: string, imageFile: any, message?: string, token?: string) {
        if (!imageFile) {
            throw new BadRequestException('الصورة مطلوبة');
        }

        const endpoint = `${this.baseUrl}/ai/image`;
        const headers = token ? { Authorization: token } : {};

        try {
            const imageUrl = await this.uploadsService.uploadFile(imageFile, 'ai-chat-images');

            const response = await firstValueFrom(
                this.httpService.post(
                    endpoint,
                    {
                        business_id: businessId,
                        image_url: imageUrl,
                        message: message || 'تحليل هذه الصورة',
                    },
                    { headers }
                )
            );

            const aiData = response.data;

            if (aiData.action === 'GET_TODAY_SALES') {
                const salesData = await this.aiDataService.getSalesData(businessId, {});
                return this.sendImageContextBackToAi(businessId, salesData, headers);
            }
            else if (aiData.action === 'GET_LOW_STOCK') {
                const stockData = await this.aiDataService.getLowStock(businessId);
                return this.sendImageContextBackToAi(businessId, stockData, headers);
            }

            return aiData;

        } catch (error) {
            throw new InternalServerErrorException(
                `Failed to process image with AI: ${error}`
            );
        }
    }

    private async sendContextBackToAi(businessId: string, originalMessage: string, contextData: any, headers: Record<string, string>) {
        const endpoint = `${this.baseUrl}/ai/analyze`;
        const analysisResponse = await firstValueFrom(
            this.httpService.post(
                endpoint,
                {
                    business_id: businessId,
                    original_message: originalMessage,
                    context_data: contextData,
                },
                { headers }
            )
        );
        return analysisResponse.data;
    }

    private async sendVoiceContextBackToAi(businessId: string, contextData: any, headers: Record<string, string>) {
        const endpoint = `${this.baseUrl}/ai/analyze`;
        const analysisResponse = await firstValueFrom(
            this.httpService.post(
                endpoint,
                {
                    business_id: businessId,
                    context_data: contextData,
                },
                { headers }
            )
        );
        return analysisResponse.data;
    }

    private async sendImageContextBackToAi(businessId: string, contextData: any, headers: Record<string, string>) {
        const endpoint = `${this.baseUrl}/ai/analyze`;
        const analysisResponse = await firstValueFrom(
            this.httpService.post(
                endpoint,
                {
                    business_id: businessId,
                    context_data: contextData,
                },
                { headers }
            )
        );
        return analysisResponse.data;
    }
}