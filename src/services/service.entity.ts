import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Barbershop } from '../barbershops/barbershop.entity';
import { BarberProfile } from '../barbers/barber-profile.entity';
import { Booking } from '../bookings/booking.entity';

@Entity('services')
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'int' })
    durationMinutes: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @ManyToOne(() => Barbershop, (barbershop) => barbershop.services, {
        onDelete: 'CASCADE',
    })
    barbershop: Barbershop;

    @ManyToOne(() => BarberProfile, (barber) => barber.services, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    barber?: BarberProfile | null;

    @OneToMany(() => Booking, (booking) => booking.service)
    bookings?: Booking[];

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
