import { uuidv4 } from 'src/utils';
import { Logger } from '../logger.service';
export const Log = (prefix: string = '_') => {
  return (_: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    const logger = new Logger(originalMethod.name);
    const instrumentationScope = `${prefix}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const now = performance.now();
      const uuid = uuidv4();
      logger.info(
        `Method ${propertyKey} started`,
        {
          traceId: uuid,
        },
        instrumentationScope,
      );
      try {
        return await originalMethod.apply(this, args);
      } finally {
        logger.info(
          `Method ${propertyKey} ended ${performance.now() - now}ms.`,
          {
            traceId: uuid,
          },
          instrumentationScope,
        );
      }
    };

    return descriptor;
  };
};
