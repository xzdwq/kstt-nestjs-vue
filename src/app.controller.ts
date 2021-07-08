import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/login')
  @Render('login')
  getHello(): object {
    return this.appService.getLogin();
  }
}
