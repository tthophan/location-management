import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IGNORE_CORE_LOGGING_KEY } from 'src/decorators';
import { Logger } from 'src/modules/loggers';
import { formatMilliseconds } from 'src/utils';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: Logger,
    public readonly reflector: Reflector,
  ) {}
  private isLoggingDisabled(ctx: ExecutionContext): boolean {
    const isDisabled = this.reflector.getAllAndOverride<boolean>(
      IGNORE_CORE_LOGGING_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    return Boolean(isDisabled);
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();
    const requestContext = request.context;

    if (!this.isLoggingDisabled(context))
      this.logger.info(
        `Accepted Request [${requestContext.cid}] - ${request.url} - ${request.method}`,
        LoggingInterceptor.name,
        {
          method: request.method,
          url: request.url,
        },
      );

    return next.handle().pipe(
      tap(() => {
        if (!this.isLoggingDisabled(context))
          this.logger.info(
            `Response [${requestContext.cid}] - [${response.statusCode}]: ${formatMilliseconds(new Date().getTime() - requestContext.requestTimestamp)}`,
            LoggingInterceptor.name,
          );
      }),
      catchError((err) => {
        if (!this.isLoggingDisabled(context)) {
          const executionTime = Math.round(
            new Date().getTime() - requestContext.requestTimestamp,
          );
          this.logger.error(
            `Exception [${requestContext.cid}] - [${response.statusCode}] - Method: ${request.method} - URL: ${request.url} - Message: ${err.message}: ${formatMilliseconds(new Date().getTime() - requestContext.requestTimestamp)}`,
            err,
            LoggingInterceptor.name,
            {
              errorCode: err.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
              method: request.method,
              url: request.url,
              executionTime,
            },
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
