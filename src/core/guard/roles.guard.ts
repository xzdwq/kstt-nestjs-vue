import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '@src/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private userService: UserService
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    const checkAll = roles.indexOf('all')
    if (!roles || checkAll > -1) {
      return true;
    }
    const checkUserDB: any = await this.userService.getUserByEmail(context.switchToHttp().getRequest().user.Email)
    const request = context.switchToHttp().getRequest();
    request.user.Role = checkUserDB.user_role
    let check
    for(let accessRole of roles) {
      let matchRole = checkUserDB.user_role.find(dbRole => dbRole.role.code === accessRole)
      if(matchRole) {
        check = matchRole.role
        break
      }
    }
    if(check) {
      return true
    } else {
      return context.switchToHttp().getResponse().status(403).send({
        isRole: false,
        message: 'Role error'
      }).end()
    }
  }

}