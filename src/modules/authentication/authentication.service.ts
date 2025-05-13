import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prisma: PrismaService
  ) { }
}
