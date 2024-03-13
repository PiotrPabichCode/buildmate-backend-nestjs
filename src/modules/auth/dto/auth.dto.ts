import { ApiProperty } from '@nestjs/swagger';

import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'E-mail' })
  @IsString()
  @MinLength(4)
  email: string;

  @ApiProperty({ description: 'Password', example: 'Test123!@#' })
  @IsString()
  @Matches(/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Za-z])\S*$/)
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ description: 'Email' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Password' })
  @IsString()
  @Matches(/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Za-z])\S*$/)
  @MinLength(6)
  @MaxLength(16)
  password: string;
}
