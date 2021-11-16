import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { TokenService } from '@src/auth/token/token.service';
import { UserAuthService } from '@src/auth/userauth/userauth.service';
import { UserService } from '@src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private tokenService: TokenService,
    private userAuthService: UserAuthService,
    private userService: UserService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const token = await this.tokenService.getToken();
    const user = await this.userAuthService.checkADFSUser(token, username, pass);
    if(user.success) {
      const checkUserDB = await this.userService.getUserByEmail(user.user.Email)
      if(checkUserDB) {
        await this.userService.update(user.user.Email, {
          department: user.user.Department,
          position: user.user.Position
        })
      } else {
        await this.userService.create({
          uuid: user.user.Id,
          full_name: user.user.DisplayName,
          login: user.user.UserName,
          email: user.user.Email,
          department: user.user.Department,
          position: user.user.Position
        })
        // TODO
        if(user.user.UserName === 'v.zhivodrov') {
          await this.userService.addUserRole(user.user.Email, 'admin')
        } else {
          await this.userService.addUserRole(user.user.Email, 'guest')
        }
      }
      this.logger.log(`${user.user.Email} success auth`, AuthService.name)
      const userDB: any = await this.userService.getUserByEmail(user.user.Email)
      user.user.Role = userDB.user_role
      user.user.DB = userDB
      return user.user
    } else {
      return null
    }
  }
}