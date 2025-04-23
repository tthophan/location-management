import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { LogLevel } from 'typeorm';
import { Environment } from './validation';

export class EnvironmentVariables {
  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsOptional()
  @IsString()
  TZ?: string;

  @IsOptional()
  @IsString()
  ENVIRONMENT?: Environment;

  @IsOptional()
  @IsString()
  LOG_LEVEL?: LogLevel;

  @IsOptional()
  @IsString()
  DATABASE_HOST?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(65535)
  DATABASE_PORT?: number;

  @IsOptional()
  @IsString()
  DATABASE_USERNAME?: string;

  @IsOptional()
  @IsString()
  DATABASE_PASSWORD?: string;

  @IsOptional()
  @IsString()
  DATABASE_NAME?: string;
}
