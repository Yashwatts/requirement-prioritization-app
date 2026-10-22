import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ProblemDetailsExceptionFilter } from './shared/infrastructure/http/filters/problem-details-exception.filter';
import { ProblemDetailsMapper } from './shared/infrastructure/http/problem-details/problem-details-mapper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const problemDetailsMapper = new ProblemDetailsMapper();
  app.useGlobalFilters(new ProblemDetailsExceptionFilter(problemDetailsMapper));

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
