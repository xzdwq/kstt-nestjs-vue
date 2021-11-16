import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Request,
  UseFilters,
  UseGuards
} from '@nestjs/common';

import { AuthExceptionFilter } from '@src/core/auth-exceptions.filter';
import { AuthenticatedGuard } from "@src/core/guard/authenticated.guard";
import { UserService } from '@src/user/user.service';
import { Roles } from "@src/core/guard/roles.decorator";
import { RolesGuard } from "@src/core/guard/roles.guard";

@Controller('api')
@UseFilters(AuthExceptionFilter)
export class UserController {
  constructor(
    private userService: UserService
  ){}

  @UseGuards(AuthenticatedGuard)
  @Get('/userinfo')
  async getUserInfo(
    @Request() req,
  ) {
    const user_info = req.user
    const userRoleDB = await this.userService.getCurrentUserRole(user_info.DB.id)
    req.user.DB.user_role = userRoleDB
    return {
      success: true,
      data: req.user
    }
  }
  // Список ролей и участники в них
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor')
  @Get('/userroles')
  async userRoles() {
    return await this.userService.getUserRoles()
  }
  // Добавить роль пользователю
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin')
  @Post('/userroles')
  async addUserRoles(
    @Body() body: Object
  ) {
    return await this.userService.addUsersRoles(body)
  }
  // Отнять роль у пользователя
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin')
  @Delete('/userroles')
  async delUserRoles(
    @Query('role_id') role_id: number,
    @Query('user_id') user_id: number,
  ) {
    return await this.userService.delUserRoles(role_id, user_id)
  }
}