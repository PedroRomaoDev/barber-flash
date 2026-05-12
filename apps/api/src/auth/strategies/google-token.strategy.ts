import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { OAuth2Client } from 'google-auth-library';
import { Request } from 'express';
import { Strategy } from 'passport-custom';

type GoogleAuthPayload = {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
};

type GoogleTokenRequest = Request & {
  body?: {
    token?: unknown;
    idToken?: unknown;
  };
};

type GoogleAuthResult = {
  googleId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
};

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

  async validate(req: GoogleTokenRequest): Promise<GoogleAuthResult> {
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

    const payload = ticket.getPayload() as GoogleAuthPayload | undefined;
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

  private extractToken(req: GoogleTokenRequest): string | null {
    const body = req.body as { token?: unknown; idToken?: unknown } | undefined;
    const bodyToken = body?.token ?? body?.idToken;
    if (typeof bodyToken === 'string' && bodyToken.length > 0) {
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
