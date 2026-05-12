import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDto {
    @ApiProperty({
        example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjU2NiJ9.eyJzdWIiOiIxMjMifQ',
        description: 'Google ID token recebido no login do app mobile.',
    })
    @IsString()
    @IsNotEmpty()
    token!: string;
}
