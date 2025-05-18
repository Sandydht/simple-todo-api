import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/lib/passport/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      signOptions: {
        expiresIn: '1h',
      },
    }),
    PassportModule,
  ],
  providers: [AuthenticationService, PrismaService, JwtService, JwtStrategy],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
