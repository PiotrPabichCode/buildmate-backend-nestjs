import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { fastifyApp } from './common/adapters/fastify.adapter';
import { setupSwagger } from './setup-swagger';
import { ConfigService } from '@nestjs/config';
import { ConfigKeyPaths, IAppConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyApp,
    {
      bufferLogs: true,
      snapshot: true,
    },
  );

  const configService = app.get(ConfigService<ConfigKeyPaths>);
  const { port, globalPrefix } = configService.get<IAppConfig>('app');

  app.setGlobalPrefix(globalPrefix);

  setupSwagger(app, configService);

  await app.listen(port, '0.0.0.0', async () => {
    const url = await app.getUrl();
    const { pid } = process;

    const logger = new Logger('NestApplication');
    logger.log(`[${pid}] Server running on ${url} | PORT: ${port}`);
  });
}
bootstrap();
