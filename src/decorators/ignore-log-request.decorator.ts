import { SetMetadata } from '@nestjs/common';
import { IGNORE_CORE_LOGGING_KEY } from './decorator.metadata';

export const IgnoreCoreLogging = () =>
  SetMetadata(IGNORE_CORE_LOGGING_KEY, true);
