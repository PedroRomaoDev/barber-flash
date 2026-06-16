import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { BarberProfile } from '../barbers/barber-profile.entity';
import { Service } from '../services/service.entity';
import { Booking } from '../bookings/booking.entity';

@Entity('barbershops')
export class Barbershop {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'text', nullable: true })
    imageUrl: string | null;

    @Column({ type: 'text', nullable: true })
    address: string | null;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone: string | null;

    @ManyToOne(() => User, (user) => user.ownedBarbershops, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    owner?: User | null;

    @ManyToMany(() => BarberProfile, (barber) => barber.barbershops)
    @JoinTable({ name: 'barbershop_barbers' })
    barbers?: BarberProfile[];

    @OneToMany(() => Service, (service) => service.barbershop)
    services?: Service[];

    @OneToMany(() => Booking, (booking) => booking.barbershop)
    bookings?: Booking[];

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
