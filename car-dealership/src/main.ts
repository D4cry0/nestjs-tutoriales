import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //solo deja la data que se espera en el dto
      forbidNonWhitelisted: true, //te marca error cuando se manda data que no este en el dto
    })
  )

  await app.listen(3000);
}
bootstrap();
