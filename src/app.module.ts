import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from '~/config';
import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler';
import { SharedModule } from './shared/shared.module';
import { DatabaseModule } from './shared/database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [...Object.values(config)],
    }),
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        errorMessage:
          'Current operation is too frequent. Please try again later!',
        throttlers: [{ ttl: seconds(10), limit: 7 }],
      }),
    }),
    SharedModule,
    DatabaseModule,
    AuthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
