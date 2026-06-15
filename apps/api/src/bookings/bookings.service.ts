import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './booking.entity';
import { User } from '../users/user.entity';
import { BarberProfile } from '../barbers/barber-profile.entity';
import { Service } from '../services/service.entity';
import { Barbershop } from '../barbershops/barbershop.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  findAllByUser(userId: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { client: { id: userId } },
      relations: ['barber', 'barber.user', 'barbershop', 'service'],
    });
  }

  findOneById(id: string): Promise<Booking | null> {
    return this.bookingRepository.findOne({
      where: { id },
      relations: ['client'],
    });
  }

  async getBookedSlots(barberId: string, dateStr: string): Promise<{ bookedSlots: string[] }> {
    const date = new Date(dateStr);
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const bookings = await this.bookingRepository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.service', 'service')
      .innerJoin('b.barber', 'barber', 'barber.id = :barberId', { barberId })
      .andWhere('b.scheduledAt >= :start', { start: startOfDay })
      .andWhere('b.scheduledAt <= :end', { end: endOfDay })
      .andWhere('b.status != :cancelled', { cancelled: BookingStatus.CANCELLED })
      .getMany();

    const bookedSlots: string[] = [];
    const ALL_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

    for (const slot of ALL_SLOTS) {
      const [h, m] = slot.split(':').map(Number);
      const slotStart = new Date(date);
      slotStart.setUTCHours(h, m, 0, 0);
      const slotEnd = new Date(slotStart.getTime() + 60 * 60000); // assume 60min per slot

      const conflict = bookings.some((b) => {
        const bStart = new Date(b.scheduledAt);
        const bEnd = new Date(bStart.getTime() + (b.service?.durationMinutes ?? 60) * 60000);
        return slotStart < bEnd && slotEnd > bStart;
      });

      if (conflict) bookedSlots.push(slot);
    }

    return { bookedSlots };
  }

  async createBooking(
    userId: string,
    barberId: string,
    barbershopId: string,
    serviceId: string,
    scheduledAt: string,
    priceSnapshot: number,
  ): Promise<Booking> {
    const service = await this.bookingRepository.manager.findOne(Service, { where: { id: serviceId } });
    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    const newStart = new Date(scheduledAt);
    const newEnd = new Date(newStart.getTime() + service.durationMinutes * 60000);

    const startOfDay = new Date(newStart);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(newStart);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await this.bookingRepository.find({
      where: { barber: { id: barberId } },
      relations: ['service'],
    });

    // Filtra para o mesmo dia e verifica conflito
    for (const b of existingBookings) {
      if (b.status === BookingStatus.CANCELLED) continue;
      
      const bStart = new Date(b.scheduledAt);
      if (bStart >= startOfDay && bStart <= endOfDay) {
        const bEnd = new Date(bStart.getTime() + (b.service?.durationMinutes || 30) * 60000);
        
        if (newStart < bEnd && newEnd > bStart) {
          throw new NotFoundException('CONFLICT: Horário já reservado para este barbeiro.');
        }
      }
    }

    const booking = this.bookingRepository.create({
      scheduledAt: newStart,
      priceSnapshot,
      client: { id: userId } as User,
      barber: { id: barberId } as BarberProfile,
      barbershop: { id: barbershopId } as Barbershop,
      service: { id: serviceId } as Service,
    });

    return this.bookingRepository.save(booking);
  }

  findAllByBarberUser(userId: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { barber: { user: { id: userId } } },
      relations: ['client', 'barbershop', 'service'],
    });
  }

  async updateStatus(id: string, status: BookingStatus): Promise<Booking | null> {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (booking) {
      booking.status = status;
      return this.bookingRepository.save(booking);
    }
    return null;
  }
}
