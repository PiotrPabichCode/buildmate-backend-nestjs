import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';

import { ISecurityConfig, SecurityConfig } from '~/config';
import { UserEntity } from '~/modules/user/user.entity';
import { generateUUID } from '~/utils';

import { AccessTokenEntity } from '../entities/access-token.entity';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
  ) {}

  async refreshToken(accessToken: AccessTokenEntity) {
    const { user, refreshToken } = accessToken;

    if (refreshToken) {
      const now = dayjs();
      if (now.isAfter(refreshToken.expired_at)) return null;

      //   const roleIds = await this.roleService.getRoleIdsByUser(user.id);
      //   const roleValues = await this.roleService.getRoleValues(roleIds);

      const token = await this.generateAccessToken(user.id, ['ADMIN']);

      await accessToken.remove();
      return token;
    }
    return null;
  }

  generateJwtSign(payload: any) {
    const jwtSign = this.jwtService.sign(payload);

    return jwtSign;
  }

  async generateAccessToken(uid: number, roles: string[] = []) {
    const payload = {
      uid,
      roles,
    };

    const jwtSign = await this.jwtService.signAsync(payload);

    const accessToken = new AccessTokenEntity();
    accessToken.value = jwtSign;
    accessToken.user = { id: uid } as UserEntity;
    accessToken.expired_at = dayjs()
      .add(this.securityConfig.jwtExprire, 'second')
      .toDate();

    await accessToken.save();

    const refreshToken = await this.generateRefreshToken(accessToken, dayjs());

    return {
      accessToken: jwtSign,
      refreshToken,
    };
  }

  async generateRefreshToken(
    accessToken: AccessTokenEntity,
    now: dayjs.Dayjs,
  ): Promise<string> {
    const refreshTokenPayload = {
      uuid: generateUUID(),
    };

    const refreshTokenSign = await this.jwtService.signAsync(
      refreshTokenPayload,
      {
        secret: this.securityConfig.refreshSecret,
      },
    );

    const refreshToken = new RefreshTokenEntity();
    refreshToken.value = refreshTokenSign;
    refreshToken.expired_at = now
      .add(this.securityConfig.refreshExpire, 'second')
      .toDate();
    refreshToken.accessToken = accessToken;

    await refreshToken.save();

    return refreshTokenSign;
  }

  async checkAccessToken(value: string) {
    return AccessTokenEntity.findOne({
      where: { value: value.replace('Bearer ', '') },
      relations: ['user', 'refreshToken'],
      cache: true,
    });
  }

  async removeAccessToken(value: string) {
    const accessToken = await AccessTokenEntity.findOne({
      where: { value },
    });
    if (accessToken) await accessToken.remove();
  }

  async removeRefreshToken(value: string) {
    const refreshToken = await RefreshTokenEntity.findOne({
      where: { value },
      relations: ['accessToken'],
    });
    if (refreshToken) {
      if (refreshToken.accessToken) await refreshToken.accessToken.remove();
      await refreshToken.remove();
    }
  }

  async verifyAccessToken(token: string) {
    return await this.jwtService.verifyAsync(token);
  }
}
