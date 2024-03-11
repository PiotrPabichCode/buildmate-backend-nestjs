import FastifyCookie from '@fastify/cookie';
import FastifyMultipart from '@fastify/multipart';
import { FastifyAdapter } from '@nestjs/platform-fastify';

const app: FastifyAdapter = new FastifyAdapter({
  trustProxy: true,
  logger: false,
});

export { app as fastifyApp };

app.register(FastifyCookie, {
  secret: 'cookie-secret', // Not important = Not associasted with authentication
});

app.register(FastifyMultipart, {
  limits: {
    fileSize: 1024 * 1024 * 5, // limit size 5MB
    files: 5, // Max number of file fields
  },
});
