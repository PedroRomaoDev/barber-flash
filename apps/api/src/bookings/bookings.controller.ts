import { Controller, Get, Post, Body, Req, UseGuards, Param, BadRequestException, Query, ForbiddenException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { AuthGuard } from '@nestjs/passport';
import { BookingStatus } from './booking.entity';

interface JwtRequest {
  user: { sub: string };
}

interface CreateBookingBody {
  barberId: string;
  barbershopId: string;
  serviceId: string;
  scheduledAt: string;
  priceSnapshot: number;
}

@Controller('bookings')
@ApiTags('Bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('availability')
  @ApiOperation({ summary: 'Retorna horários já ocupados para um barbeiro em uma data' })
  @ApiResponse({ status: 200, description: 'Lista de horários bloqueados.' })
  getAvailability(
    @Query('barberId') barberId: string,
    @Query('date') date: string,
  ) {
    return this.bookingsService.getBookedSlots(barberId, date);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('my-bookings')
  @ApiOperation({ summary: 'Listar agendamentos do usuário logado' })
  @ApiResponse({ status: 200, description: 'Lista de agendamentos.' })
  findMyBookings(@Req() req: JwtRequest) {
    return this.bookingsService.findAllByUser(req.user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Criar novo agendamento' })
  @ApiResponse({ status: 201, description: 'Agendamento criado.' })
  async create(@Req() req: JwtRequest, @Body() body: CreateBookingBody) {
    try {
      return await this.bookingsService.createBooking(
        req.user.sub,
        body.barberId,
        body.barbershopId,
        body.serviceId,
        body.scheduledAt,
        body.priceSnapshot,
      );
    } catch (e: unknown) {
      const error = e as Error;
      if (error.message && error.message.includes('CONFLICT')) {
        throw new BadRequestException('Horário não disponível');
      }
      throw e;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('barber-bookings')
  @ApiOperation({ summary: 'Listar agendamentos para o barbeiro logado' })
  @ApiResponse({ status: 200, description: 'Lista de agendamentos onde o usuário é o barbeiro.' })
  findBarberBookings(@Req() req: JwtRequest) {
    return this.bookingsService.findAllByBarberUser(req.user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/status')
  @ApiOperation({ summary: 'Atualizar status do agendamento' })
  @ApiResponse({ status: 200, description: 'Status atualizado.' })
  updateStatus(@Param('id') id: string, @Body() body: { status: BookingStatus }) {
    return this.bookingsService.updateStatus(id, body.status);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancelar agendamento (pelo cliente dono)' })
  @ApiResponse({ status: 200, description: 'Agendamento cancelado.' })
  async cancelBooking(@Param('id') id: string, @Req() req: JwtRequest) {
    const booking = await this.bookingsService.findOneById(id);
    if (!booking) throw new BadRequestException('Agendamento não encontrado');
    if (booking.client?.id !== req.user.sub) throw new ForbiddenException('Sem permissão para cancelar este agendamento');
    return this.bookingsService.updateStatus(id, BookingStatus.CANCELLED);
  }
}
