import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <--- Import this

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // This tells NestJS to verify every incoming request against your DTOs
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

}
bootstrap();
