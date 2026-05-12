import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { GoogleUserPayload } from '../users/users.service';

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
            user,
        };
    }
}
