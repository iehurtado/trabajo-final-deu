import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User, Rol } from 'src/entities';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RolesController } from './roles.controller';

@Module({
  imports: [MikroOrmModule.forFeature([User, Rol])],
  controllers: [RolesController, UsersController],
  providers: [UsersService],
})
export class UsersModule {}
