import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class LocationRequestParam {
  @Type(() => Number)
  @IsNumber()
  id: number;
}
export class LocationQueryParam {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  depth?: number;
}
