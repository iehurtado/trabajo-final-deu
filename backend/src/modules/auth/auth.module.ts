import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { OrmModule } from '../orm/orm.module';
import { JwtModule } from '@nestjs/jwt';
import { createSecretKey } from 'crypto';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    OrmModule,
    JwtModule.register({
      global: true,
      secret: createSecretKey(Buffer.from('t0ps5cr3t')), // TODO ajustar para usar .env
      signOptions: {
        expiresIn: '6h',
      },
    })
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
