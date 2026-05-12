import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { OAuth2Client } from 'google-auth-library';
import { Strategy } from 'passport-custom';
import { Request } from 'express';

@Injectable()
export class GoogleTokenStrategy extends PassportStrategy(
    Strategy,
    'google-token',
) {
    private readonly client: OAuth2Client;
    private readonly audience: string;

    constructor(private readonly configService: ConfigService) {
        super();
        this.audience = this.configService.get<string>('GOOGLE_CLIENT_ID') ?? '';
        this.client = new OAuth2Client(this.audience);
    }

    async validate(req: Request) {
        const token = this.extractToken(req);
        if (!token) {
            throw new UnauthorizedException('Google token not provided');
        }

        if (!this.audience) {
            throw new UnauthorizedException('Google client ID not configured');
        }

        const ticket = await this.client.verifyIdToken({
            idToken: token,
            audience: this.audience,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.sub || !payload.email) {
            throw new UnauthorizedException('Invalid Google token');
        }

        return {
            googleId: payload.sub,
            email: payload.email,
            name: payload.name ?? payload.email,
            avatarUrl: payload.picture ?? null,
        };
    }

    private extractToken(req: Request): string | null {
        const bodyToken = req.body?.token || req.body?.idToken;
        if (bodyToken) {
            return bodyToken;
        }

        const header = req.headers.authorization;
        if (!header) {
            return null;
        }

        const [type, token] = header.split(' ');
        if (type?.toLowerCase() !== 'bearer' || !token) {
            return null;
        }

        return token;
    }
}
