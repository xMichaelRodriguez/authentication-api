import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  //set security-related HTTP headers
  app.use(helmet());

  // the compression middleware package to enable gzip compression
  app.use(compression());

  // config documentation
  const config = new DocumentBuilder()
    .setTitle('Save Life Documentation')
    .setDescription('The Save-Life API description')
    .setVersion('1.0')
    .addTag('Auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT, async () => {
    const url = await app.getUrl();
    console.log(`listen on ${url}`);
  });
}
bootstrap();
