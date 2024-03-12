import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigKeyPaths, IAppConfig, ISwaggerConfig } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CommonEntity } from './common/entity/common.entity';

export function setupSwagger(
  app: INestApplication,
  configService: ConfigService<ConfigKeyPaths>,
): void {
  const { name, port } = configService.get<IAppConfig>('app');
  const { enable, path, version } =
    configService.get<ISwaggerConfig>('swagger');

  if (!enable) {
    return;
  }

  const documentBuilder = new DocumentBuilder()
    .setTitle(name)
    .setDescription(`${name} API Overview`)
    .setVersion(version);

  const document = SwaggerModule.createDocument(app, documentBuilder.build(), {
    ignoreGlobalPrefix: false,
    extraModels: [CommonEntity],
  });

  SwaggerModule.setup(path, app, document);

  const logger = new Logger('SwaggerModule');
  logger.log(
    `Swagger API document running on http://127.0.0.1:${port}/${path}`,
  );
}
