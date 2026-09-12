import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: { code: string; name: string; faculty: string }) {
    return this.prisma.course.create({ data });
  }

  async findAll() {
    return this.prisma.course.findMany({
      orderBy: { faculty: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.course.findUnique({ where: { id } });
  }
}