import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AiDataService } from '../ai-data/ai-data.service';

@Injectable()
export class AiChatService {
    constructor(
        private readonly httpService: HttpService,
        private readonly aiDataService: AiDataService,
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
}