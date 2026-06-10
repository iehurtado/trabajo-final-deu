import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { OrmModule } from '../orm/orm.module';
import { JwtModule } from '@nestjs/jwt';
import { createSecretKey } from 'crypto';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

let secret = process.env.JWT_SECRET;

if (!secret) {
  if (process.env.NODE_ENV == 'production') {
    throw new Error('Must set JWT_SECRET environment variable in production!');
  }

  secret = 't0ps5cr3t'
}
@Module({
  imports: [
    OrmModule,
    JwtModule.register({
      global: true,
      secret: createSecretKey(Buffer.from(secret)),
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
