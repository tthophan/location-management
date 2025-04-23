import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginateQueryParam {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cursor?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly level: number = 0;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  readonly limit: number = 10;

  @IsOptional()
  @IsString()
  search?: string;
}
