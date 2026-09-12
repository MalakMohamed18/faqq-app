import { Controller, Post, UseInterceptors, UploadedFile, Body, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UploadsService } from './uploads.service';

@ApiTags('Uploads & CDN')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('api/uploads')
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) { }

    @Post('image')
    @ApiOperation({ summary: 'Upload an image (Product or Receipt) to CDN' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                folder: {
                    type: 'string',
                    example: 'products',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file', {
        limits: { fileSize: 5 * 1024 * 1024 },
    }))
    async uploadImage(
        @UploadedFile() file: { buffer: Buffer; mimetype: string; originalname: string },
        @Body('folder') folder: string,
    ) {
        if (!file) {
            throw new Error('لم يتم إرسال أي ملف');
        }

        const targetFolder = folder || 'misc';
        const fileUrl = await this.uploadsService.uploadFile(file, targetFolder);

        return {
            message: 'تم الرفع بنجاح',
            url: fileUrl,
        };
    }
}