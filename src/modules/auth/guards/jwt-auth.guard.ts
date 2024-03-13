import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { FastifyRequest } from 'fastify';
import { isEmpty, isNil } from 'lodash';

import { BusinessException } from '~/common/exceptions/business.exception';
import { ErrorEnum } from '~/constants/error-code.constant';
import { AuthService } from '~/modules/auth/auth.service';

import { AuthStrategy, PUBLIC_KEY } from '../auth.constant';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard(AuthStrategy.JWT) {
  jwtFromRequestFn = ExtractJwt.fromAuthHeaderAsBearerToken();

  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const token = this.jwtFromRequestFn(request);

    let result: any = false;
    try {
      result = await super.canActivate(context);
    } catch (e) {
      if (isPublic) return true;

      if (isEmpty(token))
        throw new UnauthorizedException('User is not authorized');

      const accessToken = isNil(token)
        ? undefined
        : await this.tokenService.checkAccessToken(token);

      if (!accessToken) throw new BusinessException(ErrorEnum.INVALID_LOGIN);
    }

    return result;
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) throw err || new UnauthorizedException();

    return user;
  }
}
