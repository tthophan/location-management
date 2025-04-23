import { SetMetadata } from '@nestjs/common';
import { IGNORE_CORE_RESPONSE_KEY } from './decorator.metadata';

export const IgnoreCoreResponse = () =>
  SetMetadata(IGNORE_CORE_RESPONSE_KEY, true);
