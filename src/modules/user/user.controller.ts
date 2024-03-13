import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDto, UserQueryDto } from './dto/user.dto';
import { IdParam } from '~/common/decorators/id-param.decorator';
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';
import {
  Perm,
  definePermission,
} from '../auth/decorators/permission.decorator';

const permissions = definePermission('system:user', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const);

@ApiTags('Users Table - Endpoints')
@ApiSecurityAuth()
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch users' })
  @Perm(permissions.LIST)
  async list(@Query() dto: UserQueryDto) {
    return this.userService.list(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a single user by id' })
  async read(@IdParam() id: number) {
    return this.userService.info(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  async create(@Body() dto: UserDto): Promise<void> {
    await this.userService.create(dto);
  }

  @Post()
  @ApiOperation({ summary: 'Update a user' })
  async update(@Body() dto: UserDto): Promise<void> {
    await this.userService.create(dto);
  }
}
