import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { OrmModule } from './modules/orm/orm.module';
import { BalneariosModule } from './modules/balnearios/balnearios.module';
import { PuntosInteresModule } from './modules/puntos-interes/puntos-interes.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AuthModule,
    OrmModule,
    BalneariosModule,
    PuntosInteresModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
