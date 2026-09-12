import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // API: GET /users/me - Lấy profile của chính mình
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.userId);
  }
}