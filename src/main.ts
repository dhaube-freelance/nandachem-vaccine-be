import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
    }),
  );

  app.use(cookieParser());

  app.enableCors({
    origin: [process.env.ORIGIN],
    credentials: true,
  });

  await app.listen(8080);
}
bootstrap();
