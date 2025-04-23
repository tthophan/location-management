import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig, DatabaseConfig } from 'src/configurations';
import { Location } from './entities';
import { LocationRepository } from './repository';
import { databaseConfiguration } from './data-source';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...databaseConfiguration,
        entities: undefined, // use autoLoadEntities
        autoLoadEntities: true,
        logger:
          configService.get<AppConfig['logLevel']>('logLevel') === 'debug'
            ? 'debug'
            : undefined,
      }),
    }),
    TypeOrmModule.forFeature([Location]),
  ],
  providers: [LocationRepository],
  exports: [LocationRepository],
})
export class DatabaseModule {}
