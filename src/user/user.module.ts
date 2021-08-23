import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@src/user/entity/user.entity';
import { UserGroupEntity } from '@src/user/entity/user_group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserGroupEntity
    ])
  ],
  providers: [
  ],
  controllers: [
  ],
})
export class UserModule {}