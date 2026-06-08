import { Module } from '@nestjs/common';
import { BalneariosController } from './balnearios.controller';
import { BalneariosService } from './balnearios.service';
import { OrmModule } from '../orm/orm.module';

@Module({
  imports: [OrmModule],
  controllers: [BalneariosController],
  providers: [BalneariosService]
})
export class BalneariosModule {}
