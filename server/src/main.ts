import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import cors from '@fastify/cors';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter({ logger: true }) as any);
  await (app.getHttpAdapter().getInstance() as any).register(cors, { origin: true, credentials: true });
  await app.listen(4000, '0.0.0.0');
}
bootstrap();
