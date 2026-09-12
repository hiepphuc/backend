import { Controller, Post, UseGuards, Request, Body, Get } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(JwtAuthGuard)
    @Post('sync')
    async syncProfile(
        @Request() req: any,
        @Body() body: { username: string; studentId?: string }
    ) {
        // req.user được trả về từ hàm validate() bên JwtStrategy
        return this.authService.syncProfile(req.user, body);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Request() req: any) {
        return req.user;
    }
}