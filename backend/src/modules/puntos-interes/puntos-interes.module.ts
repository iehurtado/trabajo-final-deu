import { Module } from '@nestjs/common';
import { PuntosInteresController } from './puntos-interes.controller';
import { PuntosInteresService } from './puntos-interes.service';
import { OrmModule } from '../orm/orm.module';

@Module({
  imports: [OrmModule],
  controllers: [PuntosInteresController],
  providers: [PuntosInteresService]
})
export class PuntosInteresModule {}
