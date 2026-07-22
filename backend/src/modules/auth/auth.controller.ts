import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository, raw } from '@mikro-orm/postgresql';
import { Body, Controller, Get, Post, Query, Req, UnauthorizedException, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Rol, User } from 'src/entities';
import { AuthGuard } from './auth.guard';
import { Public } from './decorators';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';

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

type LoginResponse = {
  access_token: string;
  user: User;
}

type CheckEmailResponse = {
  available: boolean;
}

@Controller('auth')
export class AuthController {

  constructor(
    @InjectRepository(User) private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Rol) private readonly rolesRepository: EntityRepository<Rol>,
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
      user,
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  public async profile(@Req() req) {
    return this.userRepository.findOne({ id: req.user.sub });
  }

  @Public()
  @Post('signup')
  public async signup(@Body() form: SignupForm): Promise<User> {
    const count = await this.userRepository.createQueryBuilder()
      .where({ [raw('lower(email)')]: form.email.toLowerCase() })
      .getCount();

    if (count > 0) {
      throw new UnprocessableEntityException("La dirección de email ya está registrada");
    }

    const user = this.userRepository.create({
      email: form.email,
      fullname: form.fullname,
      password: await bcrypt.hash(form.password, 10),
    });

    const roles = await this.rolesRepository.find({ nombre: "Colaborador" });
    user.roles.set(roles);

    await this.em.flush();

    return user;
  }

  @Public()
  @Get('check-email')
  public async checkEmail(@Query('email') email: string): Promise<CheckEmailResponse> {
    const count = await this.userRepository.createQueryBuilder()
      .where({ [raw('lower(email)')]: email.toLowerCase() })
      .getCount();

    return { available: count === 0 };
  }
}


