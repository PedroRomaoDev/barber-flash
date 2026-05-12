import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Barbershop } from '../barbershops/barbershop.entity';
import { Booking } from '../bookings/booking.entity';
import { Service } from '../services/service.entity';

@Entity('barber_profiles')
export class BarberProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.barberProfile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'text', nullable: true })
    bio: string | null;

    @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
    ratingAverage: number;

    @Column({ type: 'int', default: 0 })
    ratingCount: number;

    @ManyToMany(() => Barbershop, (barbershop) => barbershop.barbers)
    barbershops?: Barbershop[];

    @OneToMany(() => Service, (service) => service.barber)
    services?: Service[];

    @OneToMany(() => Booking, (booking) => booking.barber)
    bookings?: Booking[];

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
