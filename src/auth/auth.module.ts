import { HttpModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '@src/auth/auth.service';
import { LocalStrategy } from '@src/auth/local.strategy';
import { SessionSerializer } from '@src/auth/session.serializer';
import { TokenService } from '@src/auth/token/token.service';
import { UserAuthService } from '@src/auth/userauth/userauth.service';
import { UserModule } from '@src/user/user.module';
import { UserService } from '@src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@src/user/entity/user.entity';
import { TokenEntity } from '@src/auth/token/token.entity'
import { RoleEntity } from '@src/user/entity/role.entity';
import { UserRoleEntity } from '@src/user/entity/user_role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TokenEntity,
      UserEntity,
      RoleEntity,
      UserRoleEntity
    ]),
    HttpModule,
    PassportModule,
    UserModule
  ],
  providers: [
    AuthService,
    LocalStrategy,
    SessionSerializer,
    TokenService,
    UserAuthService,
    UserService
  ],
  exports: [
    TokenService
  ]
})
export class AuthModule {}
