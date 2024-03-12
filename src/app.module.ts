import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';

import config from '~/config';
import { ThrottlerModule, seconds } from '@nestjs/throttler';
import { SharedModule } from './shared/shared.module';
import { DatabaseModule } from './shared/database/database.module';

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
    UserModule,
  ],
})
export class AppModule {}
