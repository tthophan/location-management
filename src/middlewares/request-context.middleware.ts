import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import {
  CID_HEADER_KEY,
  DEVICE_ID_HEADER_KEY,
  LANGUAGE_CODE_HEADER_KEY,
} from 'src/constants';
import { RequestContext } from 'src/models';
import asyncLocalStorage from 'src/storage/async_local';
import { generateCID, getTimestamp } from 'src/utils';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(request: Request, _: Response, next: NextFunction) {
    const cid =
      request.header(CID_HEADER_KEY) ||
      request.header(CID_HEADER_KEY.toUpperCase());
    const deviceId =
      request.header(DEVICE_ID_HEADER_KEY) ||
      request.header(DEVICE_ID_HEADER_KEY.toUpperCase());
    const lang =
      request.header(LANGUAGE_CODE_HEADER_KEY) ||
      request.header(LANGUAGE_CODE_HEADER_KEY.toUpperCase());

    request.context = new RequestContext({
      cid: generateCID(cid),
      deviceId,
      lang,
      requestTimestamp: getTimestamp(),
    });

    asyncLocalStorage.run(request.context, () => next());
  }
}
