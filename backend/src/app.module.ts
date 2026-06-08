import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { OrmModule } from './modules/orm/orm.module';
import { BalneariosModule } from './modules/balnearios/balnearios.module';

@Module({
  imports: [
    AuthModule,
    OrmModule,
    BalneariosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
