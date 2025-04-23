export type LogLevel = NestLogLevel | 'info';
import { LogLevel as NestLogLevel } from '@nestjs/common';

export interface DatabaseConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
}

export interface AppConfig {
  port: number;
  tz: string;
  env: string;
  logLevel: LogLevel;
  database: DatabaseConfig;
  rateLimit: {
    enabled: boolean;
    limit: number;
    timeWindow: number;
  };
}
