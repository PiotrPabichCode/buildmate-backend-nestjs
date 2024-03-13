import { Inject, Injectable } from '@nestjs/common';

import { isEmpty } from 'lodash';

import { BusinessException } from '~/common/exceptions/business.exception';

import { ISecurityConfig, SecurityConfig } from '~/config';
import { ErrorEnum } from '~/constants/error-code.constant';

import { UserService } from '~/modules/user/user.service';

import { md5 } from '~/utils';

import { TokenService } from './services/token.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findUserByUsername(username);

    if (isEmpty(user)) throw new BusinessException(ErrorEnum.USER_NOT_FOUND);

    const comparePassword = md5(`${password}${user.psalt}`);
    if (user.password !== comparePassword)
      throw new BusinessException(ErrorEnum.INVALID_USER_PASSWORD);

    if (user) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.userService.findUserByUsername(username);
    if (isEmpty(user)) throw new BusinessException(ErrorEnum.USER_NOT_FOUND);

    const comparePassword = md5(`${password}${user.psalt}`);
    if (user.password !== comparePassword)
      throw new BusinessException(ErrorEnum.INVALID_USER_PASSWORD);

    // const roleIds = await this.roleService.getRoleIdsByUser(user.id);

    // const roles = await this.roleService.getRoleValues(roleIds);

    const token = await this.tokenService.generateAccessToken(user.id, [
      'ADMIN',
    ]);

    // TODO: CREATE LOGIN LOG

    return token.accessToken;
  }

  async checkPassword(username: string, password: string) {
    const user = await this.userService.findUserByUsername(username);

    const comparePassword = md5(`${password}${user.psalt}`);
    if (user.password !== comparePassword)
      throw new BusinessException(ErrorEnum.INVALID_USER_PASSWORD);
  }

  async resetPassword(username: string, password: string) {
    const user = await this.userService.findUserByUsername(username);

    await this.userService.forceUpdatePassword(user.id, password);
  }
}
