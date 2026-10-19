import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './global-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Prefix all routes under /api
  app.setGlobalPrefix('api');

  // Enable CORS for the frontend origin
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  // Global input validation pipe (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown properties
      forbidNonWhitelisted: true,
      transform: true, // transform payloads to DTO class instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter (domain errors + HTTP exceptions → uniform JSON)
  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = parseInt(process.env.PORT ?? '5000', 10);
  await app.listen(port);

  console.log(`🚀 Backend running on http://localhost:${port}/api`);
}

void bootstrap();
