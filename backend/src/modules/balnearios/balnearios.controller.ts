import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { Balneario } from 'src/entities';
import { Public } from '../auth/decorators';
import { Http2ServerResponse } from 'http2';

interface Paginator<T> {
  data: T[];
  paginatorInfo: {
    currentPage: number;
    totalPages: number;
    perPage: number;
    total: number;
  }
}

class CreateBalnearioForm {
  constructor(
    public readonly nombre: string,
    public readonly latitud: number,
    public readonly longitud: number,
    public readonly estadoAgua: "APTO"|"PRECAUCION"|"NO_APTO",
    public readonly auxilio: boolean,
    public readonly banos: boolean,
    public readonly rampa: boolean,
    public readonly vigilancia: boolean,
    public readonly parrillas: boolean,
    public readonly bus: boolean,
  ) {}
}

class UpdateBalnearioForm {
  constructor(
    public readonly nombre?: string,
    public readonly latitud?: number,
    public readonly longitud?: number,
    public readonly estadoAgua?: "APTO"|"PRECAUCION"|"NO_APTO",
    public readonly auxilio?: boolean,
    public readonly banos?: boolean,
    public readonly rampa?: boolean,
    public readonly vigilancia?: boolean,
    public readonly parrillas?: boolean,
    public readonly bus?: boolean,
  ) {}
}

@Controller('balnearios')
export class BalneariosController {

  constructor(
    @InjectRepository(Balneario)
      private readonly balnearioRepository: EntityRepository<Balneario>,
    private readonly em: EntityManager,
  ) {}

  @Public()
  @Get()
  public async findAllBalnearios(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Paginator<Balneario>> {
    const count = await this.balnearioRepository.count();

    limit = Math.min(limit ?? 10, count || 10);
    const totalPages = Math.ceil(count / limit);
    page = Math.max(1, Math.min(page, totalPages));

    const data = await this.balnearioRepository.findAll({
      offset: limit * (page - 1),
      limit: limit,
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

  @Public()
  @Get(':id')
  public async findBalnearioById(@Param('id') id: number): Promise<Balneario> {
    const balneario = await this.balnearioRepository.findOne({ id });

    if (balneario == null) {
      throw new NotFoundException();
    }

    return balneario;
  }

  @Post()
  public async createBalneario(@Body() form: CreateBalnearioForm): Promise<Balneario> {
    const balneario = this.balnearioRepository.create({
      nombre: form.nombre,
      latitud: form.latitud,
      longitud: form.longitud,
      estadoAgua: form.estadoAgua,
      auxilio: form.auxilio,
      banos: form.banos,
      rampa: form.rampa,
      vigilancia: form.vigilancia,
      parrillas: form.parrillas,
      bus: form.bus,
    });

    await this.em.flush();

    return balneario;
  }

  @Patch(':id')
  public async updateBalneario(@Param('id') id: number, @Body() form: UpdateBalnearioForm): Promise<Balneario> {
    const balneario = await this.balnearioRepository.findOne({ id });

    if (balneario == null) {
      throw new NotFoundException();
    }

    this.balnearioRepository.assign(balneario, form);

    await this.em.flush();

    return balneario;
  }

  @Delete(':id')
  public async deleteBalneario(@Param('id') id: number) {
    const balneario = await this.balnearioRepository.findOne({ id });

    if (balneario == null) {
      throw new NotFoundException();
    }

    this.em.remove(balneario);
    await this.em.flush();

    return balneario;
  }
}
