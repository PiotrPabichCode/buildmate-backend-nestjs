import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { IdParam } from '~/common/decorators/id-param.decorator';

@ApiTags('Users Table - Endpoints')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

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
}
