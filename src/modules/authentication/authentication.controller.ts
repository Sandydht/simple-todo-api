import { Body, Controller, Get, InternalServerErrorException, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthenticationService } from './authentication.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
  ) { }

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    const response = await this.authenticationService.registerUser(createUserDto)
    return response
  }

  @Post('login')
  async loginUser(@Body() createUserDto: CreateUserDto) {
    const response = await this.authenticationService.loginUser(createUserDto)
    return response
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: ExpressRequest) {
    req.logout((err) => {
      if (err) {
        throw new InternalServerErrorException(err);
      }
    });

    return {
      status: 'OK',
      message: 'See u!'
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    const userId = req?.user?.sub;
    const response = await this.authenticationService.getUser(userId)
    return response;
  }
}
