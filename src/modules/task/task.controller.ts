import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth/jwt-auth.guard';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post('create-task')
  async createTask(@Req() req: any, @Body() createTaskDto: CreateTaskDto) {
    const userId = req?.user?.sub;
    const response = await this.taskService.createTask(userId, createTaskDto)
    return response;
  }
}
