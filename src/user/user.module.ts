import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from '@src/user/user.controller'
import { UserService } from '@src/user/user.service';
import { UserEntity } from '@src/user/entity/user.entity';
import { UserGroupEntity } from '@src/user/entity/user_group.entity';
import { RoleEntity } from '@src/user/entity/role.entity';
import { UserRoleEntity } from '@src/user/entity/user_role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserGroupEntity,
      RoleEntity,
      UserRoleEntity
    ])
  ],
  providers: [
    UserService
  ],
  controllers: [
    UserController
  ],
  exports: [
    UserService
  ]
})
export class UserModule {}