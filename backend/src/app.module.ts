import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { BalneariosModule } from './modules/balnearios/balnearios.module';
import { OrmModule } from './modules/orm/orm.module';
import { PuntosInteresModule } from './modules/puntos-interes/puntos-interes.module';
import { UsersModule } from './modules/users/users.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    AuthModule,
    OrmModule,
    BalneariosModule,
    PuntosInteresModule,
    UsersModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 1000,
          limit: 10,
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
