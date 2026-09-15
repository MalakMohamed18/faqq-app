import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
    @ApiProperty({
        example: 'إيه إجمالي مبيعات النهاردة؟',
        description: 'الرسالة الموجهة لمساعد الذكاء الاصطناعي',
    })
    @IsString()
    @IsNotEmpty({ message: 'الرسالة لا يمكن أن تكون فارغة' })
    message: string;
}