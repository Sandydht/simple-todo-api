import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthenticationService } from '../authentication/authentication.service';
import { CreateTaskResponse, GetTaskListResponse } from './task.model';
import { fromDateToISO, fromStringToLocalString } from 'src/lib/luxon/formatter';

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
}
