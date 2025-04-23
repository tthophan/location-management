import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  LocationQueryParam,
  LocationRequestParam,
  PaginateQueryParam,
  UpdateLocationRequestModel,
} from '../models';
import {
  CreateLocationRequestModel,
  PaginateLocationResponseModel,
} from '../models/create.model';
import { LocationService } from '../services';

@Controller({
  path: 'locations',
  version: '1.0',
})
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getLocation(
    @Query() params: PaginateQueryParam,
  ): Promise<PaginateLocationResponseModel<number>> {
    return await this.locationService.getLocations(params);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getLocationById(
    @Param() param: LocationRequestParam,
    @Query() queryParams?: LocationQueryParam,
  ) {
    return await this.locationService.getLocationById(
      param.id,
      queryParams?.depth,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteLocationById(
    @Param() params: LocationRequestParam,
  ): Promise<void> {
    await this.locationService.deleteLocationById(params.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createLocation(@Body() location: CreateLocationRequestModel) {
    await this.locationService.createLocation(location);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateLocation(
    @Param('id', ParseIntPipe) id: number,
    @Body() location: UpdateLocationRequestModel,
  ): Promise<void> {
    await this.locationService.updateLocation(id, location);
  }
}
