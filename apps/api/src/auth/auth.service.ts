import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { GoogleUserPayload } from '../users/users.service';
import { LocalLoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async loginWithGoogle(payload: GoogleUserPayload) {
        const user = await this.usersService.findOrCreateFromGoogle(payload);
        const accessToken = this.jwtService.sign({
            sub: user.id,
            role: user.role,
        });

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatarUrl: user.avatarUrl,
                role: user.role,
            },
        };
    }

    async registerWithEmail(dto: RegisterDto) {
        const user = await this.usersService.createLocalUser(dto);
        const accessToken = this.jwtService.sign({
            sub: user.id,
            role: user.role,
        });

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatarUrl: user.avatarUrl,
                role: user.role,
            },
        };
    }

    async loginWithEmail(dto: LocalLoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user || !user.password) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const accessToken = this.jwtService.sign({
            sub: user.id,
            role: user.role,
        });

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatarUrl: user.avatarUrl,
                role: user.role,
            },
        };
    }
}
