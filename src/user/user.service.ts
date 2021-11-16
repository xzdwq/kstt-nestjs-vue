import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '@src/user/entity/user.entity'
import { RoleEntity } from '@src/user/entity/role.entity';
import { UserRoleEntity } from '@src/user/entity/user_role.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserRoleEntity)
    private userRoleRepository: Repository<UserRoleEntity>
  ){}

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne(
      {
        relations: ['user_role', 'user_role.role'],
        where: { email }
      }
    )
  }

  async update(email: string, data) {
    await this.userRepository.update({ email }, data)
    return await this.userRepository.findOne({ email })
  }

  async create(data) {
    const user = await this.userRepository.create(data)
    await this.userRepository.save(user)
    return user
  }
  // Получить роль пользователя
  async getCurrentUserRole(user_id) {
    const userRole = await this.userRoleRepository.find({
      relations: ['role'],
      where: { user_id: user_id }
    })
    return userRole
  }
  // Дать пользоателю роль
  async addUserRole(email, role) {
    const checkUser = await this.getUserByEmail(email)
    const checkRole = await this.roleRepository.findOne({
      where: { code: role }
    })
    // Если есть пользователь в БД и роль корректна
    if(checkUser && checkRole) {
      // Проверяем, нет ли уже такой выданной роли для этого пользователя
      const checkDoublicateRole = await this.userRoleRepository.findOne({
        where: {
          user_id: checkUser.id,
          role_id: checkRole.id
        }
      })
      if(!checkDoublicateRole) {
        const newRole = await this.userRoleRepository.create({
          user_id: checkUser.id,
          role_id: checkRole.id
        })
        await this.userRoleRepository.save(newRole)
        this.logger.log(`User "${checkUser.email}" has been assigned a role "${role}"`, UserService.name)
      }
    }
  }
  // Список ролей и участники в них
  async getUserRoles() {
    const allRoles = await this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.user_role', 'user_role')
      .leftJoinAndSelect('user_role.user', 'user')
      .orderBy({
        'role.id': 'ASC',
        'user_role.create_at': 'ASC',
      })
      .getMany()
    return {
      success: true,
      data: allRoles
    }
  }
  // Добавить роль пользователям
  async addUsersRoles(body) {
    const role_id = body.params.id,
          users = body.params.users
    let userIdInDB
    for(let user of users) {
      // Проверяем есть ли пользователь в БД
      const checkUser = await this.getUserByEmail(user.Email)
      // Если нет, то добавляем
      if(!checkUser) {
        userIdInDB = await this.create({
          uuid: user.Id,
          full_name: user.DisplayName,
          login: user.UserName,
          email: user.Email,
          department: user.Department,
          position: user.Position
        })
      } else {
        userIdInDB = checkUser
      }
      // Проверем, есть ли уже такая же роль у пользователя
      const ceckRole = await this.userRoleRepository.find({
        where: {
          user_id: userIdInDB.id,
          role_id: role_id
        }
      })
      if(ceckRole.length === 0) {
        // Даем роль пользователю
        const newRole = await this.userRoleRepository.create({
          user_id: userIdInDB.id,
          role_id: role_id
        })
        await this.userRoleRepository.save(newRole)
      }
    }
    return {
      success: true
    }
  }
  // Отнять роль у пользователя
  async delUserRoles(role_id, user_id) {
    await this.userRoleRepository.delete({
      role_id:role_id,
      user_id: user_id
    })
    return {
      success: true
    }
  }
}