import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Role } from '../auth/roles.enum';
import { BarberProfile } from '../barbers/barber-profile.entity';
import { Barbershop } from '../barbershops/barbershop.entity';
import { Booking } from '../bookings/booking.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    avatarUrl: string | null;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
    googleId: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    password?: string | null;

    @Column({ type: 'enum', enum: Role, default: Role.CLIENT })
    role: Role;

    @OneToOne(() => BarberProfile, (profile) => profile.user, {
        cascade: true,
        nullable: true,
    })
    barberProfile?: BarberProfile | null;

    @OneToMany(() => Barbershop, (barbershop) => barbershop.owner)
    ownedBarbershops?: Barbershop[];

    @OneToMany(() => Booking, (booking) => booking.client)
    bookings?: Booking[];

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
