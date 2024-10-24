import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { provideComponentInputBinding } from '@ionic/angular/common';

async function bootstrap() {
  
 const logger =new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    }))
  await app.listen(process.env.PORT);
  logger.log(`Server arrancado en el puerto ${process.env.PORT}`)

}
bootstrap();
