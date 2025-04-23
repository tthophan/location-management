import { DataSource, DataSourceOptions } from 'typeorm';

import { default as defaultConfig } from 'src/configurations/configuration';
import path from 'path';
const dbConfig = defaultConfig().database;
//dbConfig.type
export const databaseConfiguration: DataSourceOptions = {
  type: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: [__dirname, './**/*.entity{.ts,.js}'],
  migrations: [path.resolve(__dirname + '/../../migrations/**/*.{ts,js}')],
  migrationsTableName: '_migrations',
};

export default new DataSource(databaseConfiguration);
