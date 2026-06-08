import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('App')
    .setDescription('Trabajo Final DEU 2026')
    .setVersion('0.1')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey, methodKey) => methodKey,
  });

  SwaggerModule.setup('api/docs', app, documentFactory, {
    jsonDocumentUrl: 'api/docs/json',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
