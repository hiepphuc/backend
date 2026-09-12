import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    // Lấy toàn bộ thông tin profile của một user
    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                achievements: { orderBy: { date: 'desc' } },
                enrollments: { include: { course: true } },
                // Chỉ lấy các bài viết CÔNG KHAI lên profile
                posts: {
                    where: { isAnonymous: false },
                    orderBy: { createdAt: 'desc' },
                    take: 5 // Lấy 5 bài mới nhất
                },
            },
        });

        if (!user) throw new NotFoundException('User không tồn tại');
        return user;
    }
}