import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) { }

  async create(data: { title: string; content: string; isAnonymous: boolean; courseId?: string }, authorId: string) {
    return this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        isAnonymous: data.isAnonymous,
        courseId: data.courseId || null,
        authorId: authorId,
      },
    });
  }

  async findAll() {
    const posts = await this.prisma.post.findMany({
      include: {
        author: {
          select: { id: true, username: true, avatarUrl: true, role: true },
        },
        course: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Logic Ẩn danh: Ghi đè thông tin author nếu isAnonymous = true
    return posts.map(post => {
      if (post.isAnonymous) {
        return {
          ...post,
          author: {
            id: 'hidden',
            username: 'Sinh viên ẩn danh',
            avatarUrl: null,
            role: 'STUDENT',
          },
        };
      }
      return post;
    });
  }
}