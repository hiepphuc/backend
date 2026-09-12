import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post()
    create(
        @Request() req: any,
        @Body() createCommentDto: { content: string; postId: string; isAnonymous: boolean }
    ) {
        return this.commentsService.create(createCommentDto, req.user.userId);
    }

    // API: GET /comments?postId=xxxx-xxxx
    @Get()
    findByPostId(@Query('postId') postId: string) {
        if (!postId) return [];
        return this.commentsService.findByPostId(postId);
    }
}