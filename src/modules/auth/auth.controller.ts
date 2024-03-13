import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserService } from '../user/user.service';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { LocalGuard } from './guards/local.guard';
import { LoginToken } from './models/auth.model';
import { Public } from './decorators/public.decorator';

@ApiTags('Auth Module')
@UseGuards(LocalGuard)
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('sign-in')
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() dto: LoginDto): Promise<LoginToken> {
    const token = await this.authService.login(dto.email, dto.password);
    return { token };
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'Register User' })
  async register(@Body() dto: RegisterDto): Promise<void> {
    await this.userService.register(dto);
  }
}
