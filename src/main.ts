import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import { AppModule } from './app.module';
import { Environment } from './configurations';
import { Logger } from './modules/loggers';
import { setupSwagger } from './docs';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const startBoootstrapTime = performance.now();

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    },
    logger: new Logger(),
  });

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1.0',
    prefix: 'v',
  });
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.use(
    compression({
      filter: () => {
        return true;
      },
    }),
  );

  // enable graceful shutdown
  app.enableShutdownHooks();

  const configService = await app.resolve(ConfigService);

  // Swagger setup
  if (configService.get<Environment>('env') !== Environment.Production) {
    setupSwagger(app);
  }
  const port = configService.get<number>('port') || 80;
  await app
    .listen(port)
    .then(async () => {
      const bootstrapTime = Math.round(performance.now() - startBoootstrapTime);
      logger.debug(`Application is running on: ${await app.getUrl()}`);
      logger.debug(
        `Application started in ${bootstrapTime}ms`,
        {
          executionTime: bootstrapTime,
        },
        bootstrap.name,
      );
    })
    .catch((e) => {
      console.log({ e });
    });
}
bootstrap();
