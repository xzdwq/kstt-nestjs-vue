import { Module } from '@nestjs/common';

import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
var winston = require('winston');
require('winston-daily-rotate-file');

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@cfg/configuration';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@src/user/user.module';
import { NotificationModule } from '@src/notification/notification.module';
import { KS3Module } from '@src/ks/ks3/ks3.module';
import { KS2Module } from '@src/ks/ks2/ks2.module';
import { CryptoConfigModule } from '@src/crypto/config/cryptoConfig.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpErrorFilter } from '@src/core/httperror.filter';
import { ProjectModule } from '@src/project/project.module';
import { GroupModule } from '@src/group/group.module';
import { WorkflowModule } from '@src/workflow/workflow.module';
import { AuthModule } from '@src/auth/auth.module';
import { FileModule } from '@src/file/file.module';
import { MailingModule } from '@src/mailing/mailing.module';

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
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transports: [
          new winston.transports.DailyRotateFile({
            filename: config.get('log_file_path'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxsize: config.get('log_file_max_size'),
            maxFiles: config.get('log_max_files'),
            handleExceptions: true,
            format: winston.format.combine(
              nestWinstonModuleUtilities.format.nestLike(),
              winston.format.splat(),
              winston.format.simple(),
              winston.format.metadata(),
              winston.format.timestamp({
                format: 'DD.MM.YYYY HH:mm:ss'
              }),
              winston.format.ms(),
              winston.format.printf(({ timestamp, ms, level, metadata, message, }) => {
                return `${timestamp} ${ms} ${level.toUpperCase()} [${metadata.context}] ${message}`
              })
            )
          })
        ]
      })
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
    AuthModule,
    UserModule,
    NotificationModule,
    KS3Module,
    CryptoConfigModule,
    ProjectModule,
    GroupModule,
    WorkflowModule,
    KS2Module,
    FileModule,
    MailingModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter
    }
  ],
})
export class AppModule {}
