import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID') ?? '',
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') ?? '',
            callbackURL:
                configService.get<string>('GOOGLE_CALLBACK_URL') ??
                'http://localhost:3000/auth/google/callback',
            scope: ['profile', 'email'],
        });
    }

    validate(
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
    ) {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            throw new UnauthorizedException('Google account email missing');
        }

        return {
            googleId: profile.id,
            email,
            name: profile.displayName ?? email,
            avatarUrl: profile.photos?.[0]?.value ?? null,
        };
    }
}
