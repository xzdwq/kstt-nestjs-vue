import {
  Controller,
  Get,
  Post,
  Res,
  Request,
  UseGuards,
  LoggerService,
  Inject
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Response } from 'express';

import { LoginGuard } from '@src/core/guard/login.guard';

@Controller()
export class AppController {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  @UseGuards(LoginGuard)
  @Post('/login')
  async logIn(@Request() req) {
    return {
      isAuth: true,
      user: req.user
    };
  }

  @Get('/logout')
  async logout(@Request() req, @Res() res: Response) {
    this.logger.log(`${req.user.UserName} (${req.user.Email}) logged out`, AppController.name)
    req.logout();
    res.redirect('/');
  }
}
