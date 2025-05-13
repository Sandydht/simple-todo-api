import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      global: true,
      signOptions: {
        expiresIn: '1h'
      }
    }),
    PassportModule
  ],
  providers: [
    AuthenticationService,
    PrismaService,
    JwtService,
    ConfigService
  ],
  controllers: [AuthenticationController]
})
export class AuthenticationModule { }
