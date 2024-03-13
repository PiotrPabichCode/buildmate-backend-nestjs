import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { EntityManager, In, Repository } from 'typeorm';
import { isEmpty } from 'lodash';
import { UserDto } from './dto/user.dto';
import { BusinessException } from '~/common/exceptions/business.exception';
import { ErrorEnum } from '~/constants/error-code.constant';
import { md5, randomValue } from '~/utils';
import { RegisterDto } from '../auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async info(id: number): Promise<UserEntity> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();

    return user;
  }

  async findUserById(id: number): Promise<UserEntity | undefined> {
    return this.userRepository
      .createQueryBuilder('user')
      .where({
        id,
      })
      .getOne();
  }

  async findUserByUsername(email: string): Promise<UserEntity | undefined> {
    return this.userRepository
      .createQueryBuilder('user')
      .where({
        email,
      })
      .getOne();
  }

  async create({ email, password, ...data }: UserDto): Promise<void> {
    const exists = await this.userRepository.findOneBy({
      email,
    });
    if (!isEmpty(exists))
      throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS);
  }

  async forceUpdatePassword(uid: number, password: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: uid });

    const newPassword = md5(`${password}${user.psalt}`);
    await this.userRepository.update({ id: uid }, { password: newPassword });
  }

  async register({ email, ...data }: RegisterDto): Promise<void> {
    const exists = await this.userRepository.findOneBy({
      email,
    });
    if (!isEmpty(exists))
      throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS);

    await this.entityManager.transaction(async (manager) => {
      const salt = randomValue(32);

      const password = md5(`${data.password ?? 'a123456'}${salt}`);

      const u = manager.create(UserEntity, {
        email,
        password,
        psalt: salt,
      });

      const user = await manager.save(u);

      return user;
    });
  }
}
