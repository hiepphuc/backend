import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async syncProfile(user: any, body: { username: string; studentId?: string }) {
        const { userId, email } = user;

        let dbUser = await this.prisma.user.findUnique({ where: { id: userId } });

        if (!dbUser) {
            dbUser = await this.prisma.user.create({
                data: {
                    id: userId,
                    email: email,
                    username: body.username,
                    studentId: body.studentId || null,
                },
            });
        }
        return dbUser;
    }
}