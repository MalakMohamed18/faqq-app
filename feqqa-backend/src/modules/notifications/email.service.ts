import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'sandbox.smtp.mailtrap.io',
            port: Number(process.env.MAIL_PORT) || 2525,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            connectionTimeout: 3000,
            socketTimeout: 3000,
        });
    }

    async sendOtpEmail(email: string, otp: string): Promise<boolean> {
        try {
            const mailOptions = {
                from: '"Feqqa App" <no-reply@feqqa.app>',
                to: email,
                subject: 'رمز التحقق الخاص بك في تطبيق فكه 🚀',
                html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
            <h2 style="color: #2c3e50;">أهلاً بك في نظام فكه لإدارة الأعمال!</h2>
            <p>لتأكيد حسابك، يجيب استخدام رمز التحقق (OTP) التالي:</p>
            <div style="background: #27ae60; color: #fff; font-size: 24px; font-weight: bold; padding: 10px 20px; text-align: center; border-radius: 5px; width: fit-content; margin: 20px auto;">
              ${otp}
            </div>
            <p style="color: #7f8c8d; font-size: 14px;">هذا الرمز صالح لمدة 10 دقائق فقط. لا تقم بمشاركة هذا الرمز مع أي شخص.</p>
          </div>
        `,
            };

            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Verification OTP email sent successfully to ${email}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to send email to ${email}: ${error}`);
            return false;
        }
    }
}