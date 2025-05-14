import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth/jwt-auth.guard';
import { UpdateTaskDto } from './dto/update-task.dto';

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

  @UseGuards(JwtAuthGuard)
  @Get('get-task-list')
  async getTaskList(@Req() req: any) {
    const userId = req?.user?.sub;
    const response = await this.taskService.getTaskList(userId)
    return response
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-task/:id')
  async updateTask(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {
    const userId = req?.user?.sub;
    const response = await this.taskService.updateTask(userId, id, updateTaskDto)
    return response
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-task/:id')
  async deleteTask(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const userId = req?.user?.sub;
    const response = await this.taskService.deleteTask(userId, id)
    return response
  }
}
