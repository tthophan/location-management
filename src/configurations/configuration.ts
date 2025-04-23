import { AppConfig, LogLevel } from './configuration.interface';

const env = process.env;

export default (): AppConfig => ({
  port: parseInt(env.PORT || '3000', 10),
  tz: env.TZ || 'Asia/Ho_Chi_Minh',
  env: env.ENVIRONMENT || 'development',
  logLevel: process.env.LOG_LEVEL
    ? (process.env.LOG_LEVEL as LogLevel)
    : 'info',
  database: {
    type: 'postgres',
    host: env.DATABASE_HOST || 'localhost',
    port: parseInt(env.DATABASE_PORT || '5432', 10),
    username: env.DATABASE_USERNAME || 'postgres',
    password: env.DATABASE_PASSWORD || 'postgres',
    database: env.DATABASE_NAME || 'postgres',
    synchronize: false,
  },
  rateLimit: {
    enabled: /^true$/i.test(env.RATE_LIMIT_ENABLED || 'false'),
    timeWindow: parseInt(env.RATE_LIMIT_TIME_WINDOW || '60', 10),
    limit: parseInt(env.RATE_LIMIT_LIMIT || '100', 10),
  },
});
