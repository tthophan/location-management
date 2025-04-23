import { Transform, Type } from 'class-transformer';
import { IsOptional, IsDate } from 'class-validator';
import dayjs from 'dayjs';
import { isDate } from 'lodash';

export class TimeRange {
  @IsOptional()
  @Transform(({ value }) => dayjs(value).toDate())
  // @Type(() => Date)
  @IsDate({
    message: `$property is not a valid date. Please use ISO 8601 format or timestamp`,
  })
  from?: Date;

  @IsOptional()
  @Transform(({ value }) => dayjs(value).toDate())
  @IsDate({
    message: `$property is not a valid date. Please use ISO 8601 format or timestamp`,
  })
  @Type(() => Date)
  to?: Date;
}
