import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { PuntoInteres } from 'src/entities';
import { Public } from '../auth/decorators';

interface Paginator<T> {
  data: T[];
  paginatorInfo: {
    currentPage: number;
    totalPages: number;
    perPage: number;
    total: number;
  }
}

class CreatePuntoInteresForm {
  constructor(
    public readonly nombre: string,
    public readonly latitud: number,
    public readonly longitud: number,
    public readonly categoria: string,
    public readonly subcategoria: string,
    public readonly descripcion?: string,
  ) {}
}

class UpdatePuntoInteresForm {
  constructor(
    public readonly nombre?: string,
    public readonly latitud?: number,
    public readonly longitud?: number,
    public readonly categoria?: string,
    public readonly subcategoria?: string,
    public readonly descripcion?: string,
  ) {}
}

@Controller('puntos-interes')
export class PuntosInteresController {

  constructor(
    @InjectRepository(PuntoInteres)
      private readonly puntoInteresRepository: EntityRepository<PuntoInteres>,
    private readonly em: EntityManager,
  ) {}

  @Public()
  @Get()
  public async findAllPuntosInteres(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Paginator<PuntoInteres>> {
    const count = await this.puntoInteresRepository.count();

    limit = Math.min(limit ?? 10, count || 10);
    const totalPages = Math.ceil(count / limit);
    page = Math.max(1, Math.min(page, totalPages));

    const data = await this.puntoInteresRepository.findAll({
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
  public async findPuntoInteresById(@Param('id') id: number): Promise<PuntoInteres> {
    const puntoInteres = await this.puntoInteresRepository.findOne({ id });

    if (puntoInteres == null) {
      throw new NotFoundException();
    }

    return puntoInteres;
  }

  @Post()
  public async createPuntoInteres(@Body() form: CreatePuntoInteresForm): Promise<PuntoInteres> {
    const puntoInteres = this.puntoInteresRepository.create({
      nombre: form.nombre,
      latitud: form.latitud,
      longitud: form.longitud,
      categoria: form.categoria,
      subcategoria: form.subcategoria,
      descripcion: form.descripcion,
    });

    await this.em.flush();

    return puntoInteres;
  }

  @Patch(':id')
  public async updatePuntoInteres(@Param('id') id: number, @Body() form: UpdatePuntoInteresForm): Promise<PuntoInteres> {
    const puntoInteres = await this.puntoInteresRepository.findOne({ id });

    if (puntoInteres == null) {
      throw new NotFoundException();
    }

    this.puntoInteresRepository.assign(puntoInteres, form);

    await this.em.flush();

    return puntoInteres;
  }
}
