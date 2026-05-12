import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { BarberProfile } from '../barbers/barber-profile.entity';
import { Barbershop } from '../barbershops/barbershop.entity';
import { Service } from '../services/service.entity';

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
}

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamptz' })
    scheduledAt: Date;

    @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
    status: BookingStatus;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    priceSnapshot: number;

    @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'SET NULL' })
    client: User;

    @ManyToOne(() => BarberProfile, (barber) => barber.bookings, {
        onDelete: 'SET NULL',
    })
    barber: BarberProfile;

    @ManyToOne(() => Barbershop, (barbershop) => barbershop.bookings, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    barbershop?: Barbershop | null;

    @ManyToOne(() => Service, (service) => service.bookings, {
        onDelete: 'SET NULL',
    })
    service: Service;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
