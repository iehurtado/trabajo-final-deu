import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Controller, Get } from "@nestjs/common";
import { Rol } from "src/entities";

@Controller('roles')
export class RolesController {

  constructor(
    @InjectRepository(Rol) private readonly rolesRepository: EntityRepository<Rol>,
    private readonly em: EntityManager,
  ) {}

  @Get()
  public findAllRoles() {
    return this.rolesRepository.findAll();
  }
}
