import { IsNumber, IsString, Max, Min } from 'class-validator';
import { LogLevel } from 'typeorm';
import { Environment } from './validation';

export class EnvironmentVariables {
  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  TZ: string;

  @IsString()
  ENVIRONMENT: Environment;

  @IsString()
  LOG_LEVEL: LogLevel;

  @IsString()
  DATABASE_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  DATABASE_PORT: number;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;
}
