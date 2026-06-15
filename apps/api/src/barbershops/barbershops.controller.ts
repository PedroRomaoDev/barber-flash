import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { BarbershopsService } from './barbershops.service';

import { User } from '../users/user.entity';

interface CreateBarbershopBody {
  name: string;
  address?: string;
  imageUrl?: string;
  ownerId?: string;
  owner?: Partial<User>;
}

interface CreateServiceBody {
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
}

interface AddBarberBody {
  userId: string;
  description?: string;
}

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
  create(@Body() body: CreateBarbershopBody) {
    const data: CreateBarbershopBody = { ...body };
    if (data.ownerId) {
      data.owner = { id: data.ownerId };
      delete data.ownerId;
    }
    return this.barbershopsService.create(data);
  }

  @Post(':id/services')
  @ApiOperation({ summary: 'Adicionar serviço à barbearia' })
  createService(@Param('id') id: string, @Body() body: CreateServiceBody) {
    return this.barbershopsService.addService(id, body);
  }

  @Post(':id/barbers')
  @ApiOperation({ summary: 'Adicionar barbeiro à barbearia' })
  createBarber(@Param('id') id: string, @Body() body: AddBarberBody) {
    return this.barbershopsService.addBarber(id, body.userId, body.description ?? '');
  }
}
