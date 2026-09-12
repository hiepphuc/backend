import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) { }

    async create(data: { content: string; postId: string; isAnonymous: boolean }, authorId: string) {
        return this.prisma.comment.create({
            data: {
                content: data.content,
                isAnonymous: data.isAnonymous,
                postId: data.postId,
                authorId: authorId,
            },
        });
    }

    // Lấy toàn bộ bình luận của một bài viết cụ thể
    async findByPostId(postId: string) {
        const comments = await this.prisma.comment.findMany({
            where: { postId: postId },
            include: {
                author: {
                    select: { id: true, username: true, avatarUrl: true, role: true },
                },
            },
            orderBy: { createdAt: 'asc' }, // Xếp bình luận cũ nhất lên trên
        });

        // Logic Ẩn danh
        return comments.map(comment => {
            if (comment.isAnonymous) {
                return {
                    ...comment,
                    author: {
                        id: 'hidden',
                        username: 'Sinh viên ẩn danh',
                        avatarUrl: null,
                        role: 'STUDENT',
                    },
                };
            }
            return comment;
        });
    }
}