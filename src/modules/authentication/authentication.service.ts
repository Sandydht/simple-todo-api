import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  ValidationError,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  AuthenticationErrorModel,
  AuthenticationProfileResponse,
  AuthenticationResponse,
  AuthenticationUserData,
} from './authentication.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerUser(
    createUserDto: CreateUserDto,
  ): Promise<
    ValidationError | AuthenticationErrorModel | AuthenticationResponse
  > {
    const findUser = await this.prisma.user.findFirst({
      where: {
        username: createUserDto.username,
      },
    });

    if (findUser) {
      throw new BadRequestException('User already exist!');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        password: hashedPassword,
        image_url: '',
      },
    });

    const jwtPayload = { sub: newUser.id };
    const jwtSecretKey = this.configService.get<string>('JWT_SECRET_KEY');
    const token = await this.jwtService.signAsync(jwtPayload, {
      secret: jwtSecretKey,
    });

    return {
      status: 'OK',
      access_token: token,
    };
  }

  async loginUser(
    createUserDto: CreateUserDto,
  ): Promise<
    ValidationError | AuthenticationErrorModel | AuthenticationResponse
  > {
    const findUser = await this.prisma.user.findFirst({
      where: {
        username: createUserDto.username,
      },
    });

    if (!findUser) {
      throw new BadRequestException('Username or password is incorrect!');
    }

    const isValidPassword = await bcrypt.compare(
      createUserDto.password,
      findUser.password,
    );
    if (!isValidPassword) {
      throw new BadRequestException('Username or password is incorrect!');
    }

    const jwtPayload = { sub: findUser.id };
    const jwtSecretKey = this.configService.get<string>('JWT_SECRET_KEY');
    const token = await this.jwtService.signAsync(jwtPayload, {
      secret: jwtSecretKey,
    });

    return {
      status: 'OK',
      access_token: token,
    };
  }

  async getUser(id: number): Promise<AuthenticationProfileResponse> {
    const validateUser = await this.validateUser(id);

    return {
      status: 'OK',
      data: validateUser,
    };
  }

  async validateUser(id: number): Promise<AuthenticationUserData> {
    const findUser = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!findUser) {
      throw new UnauthorizedException();
    }

    return {
      id: findUser.id,
      username: findUser.username,
      image_url: findUser.image_url,
    };
  }
}
