import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadsService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    /**
     * Uploads an image buffer to Cloudinary and returns the secure URL.
     * @param file The file intercepted by Multer
     * @param folder The folder name inside Cloudinary (e.g., 'feqqa/products')
     * @returns Secure URL of the uploaded image
     */
    async uploadFile(file: { 
        buffer: Buffer; 
        mimetype: string; 
        originalname: string 
    }, folder: string = 'general'): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: `feqqa/${folder}`,
                    resource_type: 'auto',
                },
                (error: UploadApiErrorResponse, result: UploadApiResponse) => {
                    if (error) {
                        return reject(new InternalServerErrorException(`فشل رفع الملف على Cloudinary: ${error.message}`));
                    }
                    resolve(result.secure_url);
                },
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }
}