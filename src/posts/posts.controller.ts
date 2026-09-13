import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  create(
    @Request() req: any,
    @Body() createPostDto: { title: string; content: string; isAnonymous: boolean; type: 'DISCUSSION' | 'QA'; courseId?: string }
  ) {
    return this.postsService.create(createPostDto, req.user.userId);
  }

  @Get()
  findAll(@Query('filter') filter?: 'ALL' | 'DISCUSSION' | 'QA') {
    return this.postsService.findAll(filter);
  }

  // API Đẩy Reaction
  @Post(':id/react')
  reactToPost(@Param('id') postId: string, @Request() req: any, @Body('type') type: string) {
    return this.postsService.reactToPost(req.user.userId, postId, type);
  }
}