import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/lib/passport/jwt.strategy';

@Module({
  providers: [
    TaskService,
    PrismaService,
    AuthenticationService,
    JwtStrategy,
    JwtService,
  ],
  controllers: [TaskController],
})
export class TaskModule {}
