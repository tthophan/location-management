import { DataSource } from 'typeorm';
import { DATA_SOURCE } from '../constants';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from 'src/configurations';

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async (configService: ConfigService) => {
      const databaseConfig = configService.get<DatabaseConfig>('database')!;
      const dataSource = new DataSource({
        type: databaseConfig.type as any,
        host: databaseConfig.host,
        port: databaseConfig.port,
        username: databaseConfig.username,
        password: databaseConfig.password,
        database: databaseConfig.database,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: databaseConfig.synchronize,
      });

      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
