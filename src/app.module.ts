import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppConfig } from './configurations';
import configuration from './configurations/configuration';
import { validate } from './configurations/validation';
import { ERROR_CODES } from './constants';
import { CoreExceptionFilter } from './filters';
import { ThrottlerBehindProxyGuard } from './guards';
import { CoreResponseInterceptor, LoggingInterceptor } from './interceptors';
import { RequestContextMiddleware } from './middlewares';
import { DatabaseModule } from './modules/databases';
import { HealthModule } from './modules/health';
import { LocationModule } from './modules/location';
import { Logger } from './modules/loggers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      validationOptions: {
        abortEarly: true,
      },
      load: [configuration],
    }),
    HealthModule,
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const rateLimitConfiguration =
          configService.get<AppConfig['rateLimit']>('rateLimit')!;
        return [
          {
            // default configuration
            ttl: rateLimitConfiguration.timeWindow,
            limit: rateLimitConfiguration.limit,
            errorMessage: ERROR_CODES.RATE_LIMIT_EXCEEDED,
            skipIf: () => {
              return !rateLimitConfiguration.enabled;
            },
          },
        ];
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    LocationModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [
    Logger,
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CoreResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: CoreExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          whitelist: true,
          validationError: {
            target: false,
            value: false,
          },
          stopAtFirstError: true,
        }),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
