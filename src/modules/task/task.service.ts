import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthenticationService } from '../authentication/authentication.service';
import { CreateTaskResponse } from './task.model';

@Injectable()
export class TaskService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authenticationService: AuthenticationService
  ) { }

  async createTask(userId: number, createTaskDto: CreateTaskDto): Promise<CreateTaskResponse> {
    const validateUser = await this.authenticationService.validateUser(userId);

    const newTask = await this.prismaService.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        start_date: new Date(createTaskDto.start_date).toISOString(),
        end_date: new Date(createTaskDto.end_date).toISOString(),
        is_done: createTaskDto.is_done,
        label_color: createTaskDto.label_color
      }
    })

    await this.prismaService.userTask.create({
      data: {
        user_id: validateUser.id,
        task_id: newTask.id
      }
    })

    return {
      id: newTask.id,
      title: newTask.title,
      description: newTask.description,
      start_date: String(newTask.start_date),
      end_date: String(newTask.end_date),
      is_done: newTask.is_done,
      label_color: newTask.label_color,
      created_at: String(newTask.created_at),
      updated_at: String(newTask.updated_at)
    }
  }
}
