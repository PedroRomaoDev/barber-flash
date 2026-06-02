import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarbershopsController } from './barbershops.controller';
import { BarbershopsService } from './barbershops.service';
import { Barbershop } from './barbershop.entity';
import { Service } from '../services/service.entity';
import { BarberProfile } from '../barbers/barber-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Barbershop, Service, BarberProfile])],
  controllers: [BarbershopsController],
  providers: [BarbershopsService],
  exports: [BarbershopsService],
})
export class BarbershopsModule {}
