import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../auth/roles.enum';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/dto/auth.dto';

export interface GoogleUserPayload {
    googleId: string;
    email: string;
    name: string;
    avatarUrl?: string | null;
}

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    findByGoogleId(googleId: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { googleId } });
    }

    findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async createLocalUser(dto: RegisterDto): Promise<User> {
        const existing = await this.findByEmail(dto.email);
        if (existing) {
            throw new ConflictException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const usersCount = await this.usersRepository.count();

        const user = this.usersRepository.create({
            email: dto.email,
            name: dto.name,
            password: hashedPassword,
            role: usersCount === 0 ? Role.ADMIN : Role.CLIENT,
        });

        return this.usersRepository.save(user);
    }

    async findOrCreateFromGoogle(payload: GoogleUserPayload): Promise<User> {
        const existingByGoogle = await this.findByGoogleId(payload.googleId);
        if (existingByGoogle) {
            return existingByGoogle;
        }

        const existingByEmail = await this.findByEmail(payload.email);
        if (existingByEmail) {
            existingByEmail.googleId = payload.googleId;
            if (!existingByEmail.avatarUrl && payload.avatarUrl) {
                existingByEmail.avatarUrl = payload.avatarUrl;
            }
            return this.usersRepository.save(existingByEmail);
        }

        const usersCount = await this.usersRepository.count();
        const user = this.usersRepository.create({
            email: payload.email,
            name: payload.name,
            avatarUrl: payload.avatarUrl ?? null,
            googleId: payload.googleId,
            role: usersCount === 0 ? Role.ADMIN : Role.CLIENT,
        });

        return this.usersRepository.save(user);
    }
}
