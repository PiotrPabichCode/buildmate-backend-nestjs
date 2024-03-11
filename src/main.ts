import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { fastifyApp } from './common/adapters/fastify.adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyApp,
    {
      bufferLogs: true,
      snapshot: true,
    },
  );

  await app.listen(3000);
  const url = await app.getUrl();

  const logger = new Logger('NestApplication');
  logger.log('Server running on PORT 3000', url);
}
bootstrap();
