import { Controller, Get, Post, Body, Req, UseGuards, Param, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { AuthGuard } from '@nestjs/passport';
import { BookingStatus } from './booking.entity';

@Controller('bookings')
@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('my-bookings')
  @ApiOperation({ summary: 'Listar agendamentos do usuário logado' })
  @ApiResponse({ status: 200, description: 'Lista de agendamentos.' })
  findMyBookings(@Req() req: any) {
    return this.bookingsService.findAllByUser(req.user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Criar novo agendamento' })
  @ApiResponse({ status: 201, description: 'Agendamento criado.' })
  async create(@Req() req: any, @Body() body: any) {
    try {
      return await this.bookingsService.createBooking(
        req.user.sub,
        body.barberId,
        body.barbershopId,
        body.serviceId,
        body.scheduledAt,
        body.priceSnapshot,
      );
    } catch (e) {
      if (e.message && e.message.includes('CONFLICT')) {
        throw new BadRequestException('Horário não disponível');
      }
      throw e;
    }
  }

  @Get('barber-bookings')
  @ApiOperation({ summary: 'Listar agendamentos para o barbeiro logado' })
  @ApiResponse({ status: 200, description: 'Lista de agendamentos onde o usuário é o barbeiro.' })
  findBarberBookings(@Req() req: any) {
    return this.bookingsService.findAllByBarberUser(req.user.sub);
  }

  @Post(':id/status')
  @ApiOperation({ summary: 'Atualizar status do agendamento' })
  @ApiResponse({ status: 200, description: 'Status atualizado.' })
  updateStatus(@Param('id') id: string, @Body() body: { status: BookingStatus }) {
    return this.bookingsService.updateStatus(id, body.status);
  }
}
