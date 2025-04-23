import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomErrorResponse } from './api-custom.dto';

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle(`TITLE`) // TODO: Change title
    .setDescription('API description') // TODO: Change description
    .setVersion('1.0')
    .addSecurity('bearer', {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    extraModels: [CustomErrorResponse],
    operationIdFactory: (_: string, methodKey: string) => methodKey,
  });
  SwaggerModule.setup('api/docs', app, document);
}
