import { Controller, Post, UseGuards, Request, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('sync')
  async syncProfile(
    @Request() req: any, 
    @Body() body: { username: string; studentId?: string }
  ) {
    console.log('\n--- BẮT ĐẦU ĐỒNG BỘ DATABASE ---');
    console.log('1. User từ Token Supabase:', req.user);
    console.log('2. Dữ liệu Frontend gửi xuống:', body);
    
    try {
      const result = await this.authService.syncProfile(req.user, body);
      console.log('3. LƯU DATABASE THÀNH CÔNG:', result);
      return result;
    } catch (error: any) {
      console.error('3. LỖI LƯU DATABASE:', error.message || error);
      
      // Trả thẳng mã lỗi chi tiết về cho Frontend
      throw new HttpException(
        error.message || 'Lỗi Prisma Database',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }
}