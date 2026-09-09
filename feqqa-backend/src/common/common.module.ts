import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';
import { HashingService } from './services/hashing.service';

@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.getOrThrow<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: config.getOrThrow<string>('JWT_EXPIRES_IN') as any,
                },
            }),
        }),
    ],
    providers: [AuthGuard, HashingService],
    exports: [AuthGuard, JwtModule, HashingService],
})
export class CommonModule { }