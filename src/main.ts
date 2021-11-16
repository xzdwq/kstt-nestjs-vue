import { Logger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as path from 'path';
import * as session from 'express-session';
import * as passport from 'passport';

import { AppModule } from './app.module';

async function run() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const config = app.get(ConfigService)

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.enableCors()

  app.useStaticAssets(path.resolve('.', 'public'))

  app.engine('html', require('ejs').renderFile)
  app.setBaseViewsDir([
    path.resolve('.', 'views')
  ]);
  app.set('view engine', 'html')

  app.use(
    session({
      secret: config.get('session_secret_key'),
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: +config.get('session_age')
      }
    })
  )

  app.use(passport.initialize())
  app.use(passport.session())

  const PORT = config.get('port')

  await app.listen(
    PORT,
    () => Logger.log(`Server running on port ${PORT}`, 'NestApplication')
  )
}
run();