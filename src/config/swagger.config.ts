import { ConfigType, registerAs } from '@nestjs/config';

import { env, envBoolean } from '~/global/env';

export const swaggerConfigToken = 'swagger';

export const SwaggerConfig = registerAs(swaggerConfigToken, () => ({
  enable: envBoolean('SWAGGER_ENABLE'),
  path: env('SWAGGER_PATH'),
  version: env('SWAGGER_VERSION'),
}));

export type ISwaggerConfig = ConfigType<typeof SwaggerConfig>;
