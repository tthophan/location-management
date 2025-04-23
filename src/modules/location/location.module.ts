import { Module } from '@nestjs/common';
import { LocationController } from './controllers';

@Module({
  imports: [],
  controllers: [LocationController],
  providers: [],
})
export class LocationModule {}
