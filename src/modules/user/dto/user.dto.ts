import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, ValidateIf } from 'class-validator';
import { isEmpty } from 'lodash';

export class UserDto {
  @ApiProperty({ description: 'E-mail', example: 'pabich.dev@gmail.com' })
  @IsEmail()
  @ValidateIf((o) => !isEmpty(o.email))
  email: string;

  @ApiProperty({ description: 'Account password', example: 'test123!' })
  @IsOptional()
  password: string;

  @ApiProperty({ description: 'Phone Number' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class UserUpdateDto extends PartialType(UserDto) {}
