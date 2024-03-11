import { AppConfig, appConfigToken, IAppConfig } from './app.config';
import {
  DatabaseConfig,
  dbConfigToken,
  IDatabaseConfig,
} from './database.config';
import {
  SwaggerConfig,
  swaggerConfigToken,
  ISwaggerConfig,
} from './swagger.config';

export * from './app.config';
export * from './database.config';
export * from './swagger.config';

export interface AllConfigType {
  [appConfigToken]: IAppConfig;
  [dbConfigToken]: IDatabaseConfig;
  [swaggerConfigToken]: ISwaggerConfig;
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;

export default {
  AppConfig,
  DatabaseConfig,
  SwaggerConfig,
};
