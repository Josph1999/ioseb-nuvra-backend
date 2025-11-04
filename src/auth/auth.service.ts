import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(register: RegisterDto) {
    const { email, name, password } = register;

    const foundedUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (foundedUser) {
      return new BadRequestException('User already exsists');
    }

    const newUser = await this.prisma.user.create({
      email,
      password,
      name,
    });

    return {
      id: newUser.id,
    };
  }

  async login(login: LoginDto) {
    const { email, password } = login;

    const foundedUser = await this.prisma.user.findOne({
      where: {
        email,
        password,
      },
    });

    if (!foundedUser) {
      return new NotFoundException('User not found');
    }

    return foundedUser;
  }
}
