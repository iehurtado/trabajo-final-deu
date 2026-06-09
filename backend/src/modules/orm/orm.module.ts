import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Balneario, PuntoInteres, User } from 'src/entities';

import config from 'src/mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    MikroOrmModule.forFeature({
      entities: [Balneario, PuntoInteres, User],
    }),
  ],
  exports: [
    MikroOrmModule,
  ],
})
export class OrmModule {}
