import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private config: ConfigService
  ){}
  getLogin(): object {
    return {
      message: 'Login Form'
    };
  }
}
