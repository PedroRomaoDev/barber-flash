import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { GoogleUserPayload } from '../users/users.service';
import { GoogleLoginDto } from './dto/google-login.dto';
import { Response } from 'express';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) { }

    @Post('google')
    @UseGuards(AuthGuard('google-token'))
    @ApiOperation({ summary: 'Login com Google e retorno de JWT' })
    @ApiBody({ type: GoogleLoginDto })
    @ApiResponse({ status: 201, description: 'JWT emitido com sucesso.' })
    googleLogin(
        @Body() _body: GoogleLoginDto,
        @Req() req: { user: GoogleUserPayload },
    ) {
        return this.authService.loginWithGoogle(req.user);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Inicia OAuth2 com Google (redireciona)' })
    googleOAuthStart() {
        return;
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Callback OAuth2 do Google' })
    async googleOAuthCallback(
        @Req() req: { user: GoogleUserPayload },
        @Res() res: Response,
    ) {
        const result = await this.authService.loginWithGoogle(req.user);
        const redirectUrl = this.configService.get<string>('FRONTEND_REDIRECT_URL');

        if (redirectUrl) {
            const url = new URL(redirectUrl);
            url.searchParams.set('token', result.accessToken);
            return res.redirect(url.toString());
        }

        return res.json(result);
    }
}
