import { ConfigType, registerAs } from '@nestjs/config';

import { env, envNumber } from '~/global/env';

export const appConfigToken = 'app';

export const AppConfig = registerAs(appConfigToken, () => ({
  name: env('APP_NAME'),
  baseUrl: env('APP_BASE_URL'),
  port: envNumber('APP_PORT', 3000),
  locale: env('APP_LOCALE', 'pl-PL'),
  globalPrefix: env('APP_GLOBAL_PREFIX', 'api'),

  logger: {
    level: env('LOGGER_LEVEL'),
    maxFiles: envNumber('LOGGER_MAX_FILES'),
  },
}));

export type IAppConfig = ConfigType<typeof AppConfig>;
