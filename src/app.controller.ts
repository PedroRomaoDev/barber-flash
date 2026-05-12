import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiTags('App')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({ summary: 'Healthcheck basico' })
  @ApiResponse({ status: 200, description: 'Servico ativo.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
