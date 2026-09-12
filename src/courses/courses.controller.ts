import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CoursesService } from './courses.service.js';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Post()
  create(@Body() createCourseDto: { code: string; name: string; faculty: string }) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }
}