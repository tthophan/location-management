import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLocationRequestModel {
  @IsString()
  name: string;

  @IsString()
  building: string;

  @IsString()
  description: string;

  @IsNumber()
  area: number;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}

export class UpdateLocationRequestModel extends CreateLocationRequestModel {}

export class LocationResponseModel {
  id: number;
  name: string;
  building: string;
  area: number;
  parent?: LocationResponseModel;
  children?: LocationResponseModel[];
}
export class PaginateLocationResponseModel<TCursor> {
  items: LocationResponseModel[];
  total: number;
  limit: number;
  nextCursor?: TCursor;
  prevCursor?: TCursor;
  constructor(partial: Partial<PaginateLocationResponseModel<TCursor>>) {
    Object.assign(this, partial);
  }
}
