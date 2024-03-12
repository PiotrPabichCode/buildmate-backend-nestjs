import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

import { LoggerModule } from './logger/logger.module';

@Global()
@Module({
  imports: [
    // logger
    LoggerModule.forRoot(),
    // http
    HttpModule,
    // rate limit
    ThrottlerModule.forRoot([
      {
        limit: 3,
        ttl: 60000,
      },
    ]),
  ],
  exports: [HttpModule],
})
export class SharedModule {}
