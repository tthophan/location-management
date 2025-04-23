import { Logger } from './logger.service';

describe('LoggerService', () => {
  let service: Logger;
  beforeEach(async () => {
    jest.clearAllMocks();
    process.env.LOG_LEVEL = 'all';
    service = new Logger('test');
  });

  describe('log', () => {
    it('should be defined', () => {
      expect(service.log).toBeDefined();
    });

    it('should log', () => {
      JSON.stringify = jest.fn();
      service.log('null');
      expect(JSON.stringify).toHaveBeenCalledTimes(1);
      expect(JSON.stringify).toHaveBeenCalledWith(
        {
          message: expect.objectContaining({
            severityNumber: 9,
            severityText: 'info',
            body: 'null',
          }),
          level: 'log',
          pid: expect.any(Number),
          timestamp: expect.any(Number),
        },
        expect.anything(),
      );
    });
  });

  describe('info', () => {
    it('should log', () => {
      const stringify = jest.fn();
      JSON.stringify = stringify;
      service.info('test');
      expect(JSON.stringify).toHaveBeenCalledTimes(1);
      expect(stringify).toHaveBeenCalledWith(
        {
          message: expect.objectContaining({
            severityNumber: 9,
            severityText: 'info',
            body: 'test',
          }),
          level: 'log',
          pid: expect.any(Number),
          timestamp: expect.any(Number),
        },
        expect.anything(),
      );
    });
  });

  describe('warn', () => {
    it('should log', () => {
      const stringify = jest.fn();
      JSON.stringify = stringify;
      service.warn('test', '{}');
      expect(JSON.stringify).toHaveBeenCalledTimes(1);
      expect(stringify).toHaveBeenCalledWith(
        {
          message: expect.objectContaining({
            severityNumber: 13,
            severityText: 'warn',
            body: 'test',
          }),

          level: 'warn',
          pid: expect.any(Number),
          timestamp: expect.any(Number),
        },
        expect.anything(),
      );
    });
  });

  describe('debug', () => {
    it('should log', () => {
      const stringify = jest.fn();
      JSON.stringify = stringify;
      service.debug('test', '{}');
      expect(JSON.stringify).toHaveBeenCalledTimes(1);
      expect(stringify).toHaveBeenCalledWith(
        {
          message: expect.objectContaining({
            severityNumber: 5,
            severityText: 'debug',
            body: 'test',
          }),
          level: 'debug',
          pid: expect.any(Number),
          timestamp: expect.any(Number),
        },
        expect.anything(),
      );
    });
  });
});
