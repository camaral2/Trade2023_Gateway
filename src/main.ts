import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './services/config/config.service';
import { ValidationPipe } from '@nestjs/common';
import logger from './utils/logger';
import cors from 'cors';

const serviceName = process.env.npm_package_name;
const serviceVersion = process.env.npm_package_version;

const port = new ConfigService().get('port') || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors());
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  //app.use(helmet());

  const options = new DocumentBuilder()
    .setTitle('API docs')
    .addTag('compra')
    .addTag('acoes')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, () => {
    logger.log(`Listening ${serviceName}:${port} - ${serviceVersion}...`);
  });
}
bootstrap();
