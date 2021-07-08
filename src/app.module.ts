import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@cfg/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KS3Module } from '@ks3/ks3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        configuration
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...config.get('database').ms_kstt,
        synchronize: true,
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
    KS3Module
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}
