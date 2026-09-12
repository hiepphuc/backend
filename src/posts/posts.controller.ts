import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('posts')
@UseGuards(JwtAuthGuard) // Bảo vệ toàn bộ endpoint trong controller này
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  create(
    @Request() req: any,
    @Body() createPostDto: { title: string; content: string; isAnonymous: boolean; courseId?: string }
  ) {
    // Lấy userId từ token đã giải mã
    return this.postsService.create(createPostDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }
}