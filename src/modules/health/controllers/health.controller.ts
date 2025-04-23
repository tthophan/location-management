import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { IgnoreCoreLogging, IgnoreCoreResponse } from 'src/decorators';

@IgnoreCoreLogging()
@Controller({
  path: 'healthcheck',
  version: VERSION_NEUTRAL,
})
@IgnoreCoreResponse()
export class HealthController {
  @Get()
  async check(): Promise<{ status: string }> {
    return {
      status: 'ok',
    };
  }
}
