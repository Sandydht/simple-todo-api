import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthenticationService } from '../authentication/authentication.service';
import { CreateTaskResponse, GetTaskListResponse, TaskData, UserTaskData } from './task.model';
import { fromDateToISO, fromStringToLocalString } from 'src/lib/luxon/formatter';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authenticationService: AuthenticationService
  ) { }

  async createTask(userId: number, createTaskDto: CreateTaskDto): Promise<CreateTaskResponse> {
    const validateUser = await this.authenticationService.validateUser(userId);

    const startDate = fromDateToISO(new Date(createTaskDto.start_date));
    const endDate = fromDateToISO(new Date(createTaskDto.end_date));
    const newTask = await this.prismaService.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        start_date: String(startDate),
        end_date: String(endDate),
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
      status: 'OK',
      data: {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        start_date: fromStringToLocalString(String(newTask.start_date)),
        end_date: fromStringToLocalString(String(newTask.end_date)),
        is_done: newTask.is_done,
        label_color: newTask.label_color,
        created_at: new Date(newTask.created_at).toISOString(),
        updated_at: new Date(newTask.updated_at).toISOString()
      }
    }
  }

  async getTaskList(userId: number): Promise<GetTaskListResponse> {
    const validateUser = await this.authenticationService.validateUser(userId);

    const findUserTask = await this.prismaService.userTask.findMany({
      where: {
        user_id: validateUser.id
      },
      include: {
        task: true
      },
      orderBy: {
        updated_at: 'desc'
      }
    })

    if (findUserTask.length < 1) {
      return {
        status: 'OK',
        data: []
      }
    }

    const mapTaskList = findUserTask.map((item) => ({
      ...item.task,
      start_date: fromStringToLocalString(String(item.task.start_date)),
      end_date: fromStringToLocalString(String(item.task.end_date)),
      created_at: fromDateToISO(item.task.created_at),
      updated_at: fromDateToISO(item.task.updated_at)
    }))

    return {
      status: 'OK',
      data: mapTaskList
    }
  }

  async updateTask(userId: number, taskId: number, updateTaskDto: UpdateTaskDto): Promise<CreateTaskResponse> {
    const validatedUser = await this.authenticationService.validateUser(userId);
    const validatedUserTask = await this.validateUserTask(validatedUser.id, taskId);
    const validatedTask = await this.validateTask(validatedUserTask.task_id);

    const startDate = fromDateToISO(new Date(updateTaskDto.start_date));
    const endDate = fromDateToISO(new Date(updateTaskDto.end_date));
    const updatedTask = await this.prismaService.task.update({
      where: {
        id: validatedTask.id
      },
      data: {
        ...updateTaskDto,
        start_date: String(startDate),
        end_date: String(endDate)
      }
    })

    return {
      status: 'OK',
      data: {
        id: updatedTask.id,
        title: updatedTask.title,
        description: updatedTask.description,
        start_date: fromStringToLocalString(String(updatedTask.start_date)),
        end_date: fromStringToLocalString(String(updatedTask.end_date)),
        is_done: updatedTask.is_done,
        label_color: updatedTask.label_color,
        created_at: new Date(updatedTask.created_at).toISOString(),
        updated_at: new Date(updatedTask.created_at).toISOString()
      }
    }
  }

  async validateUserTask(userId: number, taskId: number): Promise<UserTaskData> {
    const findUserTask = await this.prismaService.userTask.findFirst({
      where: {
        user_id: userId,
        task_id: taskId
      }
    })

    if (!findUserTask) {
      throw new NotFoundException('User task not found')
    }

    return {
      id: findUserTask.id,
      user_id: findUserTask.user_id,
      task_id: findUserTask.task_id
    }
  }

  async validateTask(taskId: number): Promise<TaskData> {
    const findTask = await this.prismaService.task.findFirst({
      where: {
        id: taskId
      }
    })

    if (!findTask) {
      throw new NotFoundException('Task not found!');
    }

    return {
      id: findTask.id,
      title: findTask.title,
      description: findTask.description,
      start_date: fromStringToLocalString(String(findTask.start_date)),
      end_date: fromStringToLocalString(String(findTask.end_date)),
      is_done: findTask.is_done,
      label_color: findTask.label_color,
      created_at: new Date(findTask.created_at).toISOString(),
      updated_at: new Date(findTask.updated_at).toISOString()
    }
  }
}
