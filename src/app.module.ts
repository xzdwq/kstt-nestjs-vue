import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@cfg/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@src/user/user.module';
import { NotificationModule } from '@src/notification/notification.module';
import { KS3Module } from '@src/ks/ks3/ks3.module';
import { DocumentStatusModule } from '@src/status/document/document_status.module'
import { CryptoConfigModule } from '@src/crypto/config/cryptoConfig.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV}`
      ],
      load: [
        configuration
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...config.get('database').ms_kstt,
        synchronize: config.get('mode') === 'development' ? true : false,
        extra: {
          validateConnection: false,
          trustServerCertificate: true
        },
        poll: {
          max: 50
        },
        options: {
          useUTC: true
        },
        logging: ['error'],
        autoLoadEntities: true
      })
    }),
    UserModule,
    NotificationModule,
    KS3Module,
    DocumentStatusModule,
    CryptoConfigModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}
