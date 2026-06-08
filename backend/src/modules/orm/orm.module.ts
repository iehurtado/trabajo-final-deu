import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from 'src/entities';

import config from 'src/mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    MikroOrmModule.forFeature({
      entities: [User],
    }),
  ],
  exports: [
    MikroOrmModule,
  ],
})
export class OrmModule {}
