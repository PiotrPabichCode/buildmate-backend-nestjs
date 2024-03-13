import { ApiProperty } from '@nestjs/swagger';

export class LoginToken {
  @ApiProperty({ description: 'JWT Token' })
  token: string;
}
