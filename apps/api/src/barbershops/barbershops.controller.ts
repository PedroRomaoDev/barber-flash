import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { BarbershopsService } from './barbershops.service';

@Controller('barbershops')
@ApiTags('Barbershops')
export class BarbershopsController {
  constructor(private readonly barbershopsService: BarbershopsService) {}

  @Post('seed')
  @ApiOperation({ summary: 'Popular banco de dados com dados de teste' })
  seed() {
    return this.barbershopsService.seed();
  }

  @Get()
  @ApiOperation({ summary: 'Listar barbearias' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nome' })
  @ApiQuery({ name: 'ownerId', required: false, description: 'Buscar por dono' })
  @ApiResponse({ status: 200, description: 'Lista de barbearias.' })
  findAll(@Query('search') search?: string, @Query('ownerId') ownerId?: string) {
    return this.barbershopsService.findAll(search, ownerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter barbearia por ID' })
  @ApiResponse({ status: 200, description: 'Detalhes da barbearia.' })
  findOne(@Param('id') id: string) {
    return this.barbershopsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cadastrar nova barbearia' })
  @ApiResponse({ status: 201, description: 'Barbearia criada.' })
  create(@Body() body: any) {
    if (body.ownerId) {
      body.owner = { id: body.ownerId };
      delete body.ownerId;
    }
    return this.barbershopsService.create(body);
  }

  @Post(':id/services')
  @ApiOperation({ summary: 'Adicionar serviço à barbearia' })
  createService(@Param('id') id: string, @Body() body: any) {
    return this.barbershopsService.addService(id, body);
  }

  @Post(':id/barbers')
  @ApiOperation({ summary: 'Adicionar barbeiro à barbearia' })
  createBarber(@Param('id') id: string, @Body() body: any) {
    return this.barbershopsService.addBarber(id, body.userId, body.description);
  }
}
