import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function run() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const config = app.get(ConfigService)

  app.enableCors()

  const PORT = config.get('port')

  await app.listen(
    PORT,
    () => Logger.log(`Server running on port ${PORT}`, 'NestApplication')
  )
}
run();