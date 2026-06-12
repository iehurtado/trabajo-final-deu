import { MikroORM } from '@mikro-orm/postgresql';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import ormConfig from './mikro-orm.config';
import { DatabaseSeeder } from './seeders/DatabaseSeeder';

async function bootstrap() {
  const orm = await MikroORM.init(ormConfig);
  await orm.migrator.up();

  if (process.env.SEED_DATABASE) {
    await orm.seeder.seed(DatabaseSeeder);
  }

  await orm.close();

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CORS_ALLOW_ORIGINS?.split(',') || 'http://localhost:4200',
    }
  });

  app.setGlobalPrefix('api');

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

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
