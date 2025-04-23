import { IsNotEmpty, IsString } from 'class-validator';

export class TenantParams {
  @IsString()
  @IsNotEmpty()
  tenantCode: string;
}
export class TenantQueryParams {
  @IsString()
  @IsNotEmpty({
    message: '$property query parameter is required',
  })
  serverGroupCode: string;
}
