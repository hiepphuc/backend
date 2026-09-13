import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) { }

  async create(data: { title: string; content: string; isAnonymous: boolean; type: 'DISCUSSION' | 'QA'; courseId?: string }, authorId: string) {
    return this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        isAnonymous: data.isAnonymous,
        type: data.type,
        courseId: data.courseId || null,
        authorId: authorId,
      },
    });
  }

  async findAll(filter?: 'ALL' | 'DISCUSSION' | 'QA', page: number = 1, limit: number = 5) {
    const whereClause = filter && filter !== 'ALL' ? { type: filter } : {};

    // Công thức tính số bài cần bỏ qua (Ví dụ: trang 2, limit 5 -> bỏ qua 5 bài đầu)
    const skip = (page - 1) * limit;

    const posts = await this.prisma.post.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }, // Luôn lấy bài mới nhất trước
      take: limit,
      skip: skip,
      include: {
        author: { select: { id: true, username: true, avatarUrl: true, role: true } },
        course: true,
        reactions: true,
        _count: { select: { comments: true } }
      },
    });

    return posts.map(post => {
      let finalAuthor = post.author;
      if (post.isAnonymous) {
        finalAuthor = { id: 'hidden', username: 'Sinh viên ẩn danh', avatarUrl: null, role: 'STUDENT' };
      }
      return { ...post, author: finalAuthor };
    });
  }

  // Hàm xử lý "Thả cảm xúc" thông minh
  async reactToPost(userId: string, postId: string, type: string) {
    // Tìm xem user đã thả cảm xúc bài này chưa
    const existing = await this.prisma.reaction.findUnique({
      where: { userId_postId: { userId, postId } }
    });

    // 1. Nếu bấm lại đúng nút cũ -> Huỷ cảm xúc (Unlike/Unvote)
    if (existing && existing.type === type) {
      return this.prisma.reaction.delete({ where: { id: existing.id } });
    }

    // 2. Nếu bấm nút khác -> Cập nhật cảm xúc mới
    if (existing) {
      return this.prisma.reaction.update({
        where: { id: existing.id },
        data: { type: type as any }
      });
    }

    // 3. Nếu chưa có -> Tạo mới
    return this.prisma.reaction.create({
      data: { userId, postId, type: type as any }
    });
  }
}