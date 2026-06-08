import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities';
import { AuthGuard } from './auth.guard';
import { Public } from './decorators';

class LoginCredentials {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}

class SignupForm {
  constructor(
    public readonly email: string,
    public readonly fullname: string,
    public readonly password: string,
    public readonly password_confirm: string,
  ) {}
}

class UserDto {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly fullname: string,
  ) {}
}

type LoginResponse = {
  access_token: string;
  user: UserDto;
}

@Controller('auth')
export class AuthController {

  constructor(
    @InjectRepository(User) private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('login')
  public async login(@Body() credentials: LoginCredentials): Promise<LoginResponse> {
    const user = await this.userRepository.findOne({ email: credentials.email });

    if (user == null || ! await bcrypt.compare(credentials.password, user.password)) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const payload = { sub: user.id, username: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: new UserDto(user.id, user.email, user.fullname),
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  public async profile(@Req() req) {
    const user = await this.userRepository.findOne({ id: req.user.sub });
    return new UserDto(user!.id, user!.email, user!.fullname);
  }

  @Public()
  @Post('signup')
  public async signup(@Body() form: SignupForm): Promise<UserDto> {
    const user = this.userRepository.create({
      email: form.email,
      fullname: form.fullname,
      password: await bcrypt.hash(form.password, 10),
    });

    await this.em.flush();

    return new UserDto(user.id, user.email, user.fullname);
  }
}


