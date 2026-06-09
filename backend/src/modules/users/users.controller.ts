import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Rol, User } from 'src/entities';

interface Paginator<T> {
  data: T[];
  paginatorInfo: {
    currentPage: number;
    totalPages: number;
    perPage: number;
    total: number;
  }
}

class CreateUserForm {
  constructor(
    public readonly email: string,
    public readonly fullname: string,
    public readonly password: string,
    public readonly roles: number[],
  ) {}
}

class UpdateUserForm {
  constructor(
    public readonly email?: string,
    public readonly fullname?: string,
    public readonly password?: string,
    public readonly roles?: number[],
  ) {}
}

@Controller('users')
export class UsersController {

  constructor(
    @InjectRepository(User)
      private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Rol)
      private readonly rolRepository: EntityRepository<Rol>,
    private readonly em: EntityManager,
  ) {}

  @Get()
  public async findAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Paginator<User>> {
    const count = await this.userRepository.count();

    limit = Math.min(limit ?? 10, count || 10);
    const totalPages = Math.ceil(count / limit);
    page = Math.max(1, Math.min(page, totalPages));

    const data = await this.userRepository.findAll({
      offset: limit * (page - 1),
      limit: limit,
      populate: ['roles'],
    });

    return {
      data,
      paginatorInfo: {
        currentPage: page,
        perPage: limit,
        totalPages,
        total: count,
      }
    };
  }

  @Get(':id')
  public async findUserById(@Param('id') id: number): Promise<User> {
    const user = await this.userRepository.findOne(
      { id },
      { populate: ['roles'] }
    );

    if (user == null) {
      throw new NotFoundException();
    }

    return user;
  }

  @Post()
  public async createUser(@Body() form: CreateUserForm): Promise<User> {
    const user = this.userRepository.create({
      email: form.email,
      fullname: form.fullname,
      password: form.password,
      roles: await this.rolRepository.find({ id: { $in: form.roles }}),
    });

    await this.em.flush();

    return user;
  }

  @Patch(':id')
  public async updateUser(
    @Param('id') id: number,
    @Body() form: UpdateUserForm
  ): Promise<unknown> {
    const user = await this.userRepository.findOne(
      { id },
      { populate: ['roles'] },
    );

    if (user == null) {
      throw new NotFoundException();
    }

    if (form.email) user.email = form.email;
    if (form.fullname) user.fullname = form.fullname;
    if (form.password) user.password = await bcrypt.hash(form.password, 10);

    if (form.roles) {
      const roles = await this.rolRepository.find({ id: { $in: form.roles } });
      user.roles.set(roles);
    }

    await this.em.flush();
    await this.em.populate(user, ['roles']);

    return user;
  }
}
