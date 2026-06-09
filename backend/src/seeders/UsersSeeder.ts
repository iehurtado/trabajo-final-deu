import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User, Rol } from 'src/entities';
import * as bcrypt from 'bcrypt';

export class UsersSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    // First ensure roles exist
    const roles = [
      { nombre: "Administrador" },
      { nombre: "Colaborador" },
    ];

    for (const roleData of roles) {
      const existing = await em.findOne(Rol, { nombre: roleData.nombre });
      if (!existing) {
        em.create(Rol, roleData);
      }
    }

    const adminRole = await em.findOneOrFail(Rol, { nombre: "Administrador" });
    const colabRole = await em.findOneOrFail(Rol, { nombre: "Colaborador" });

    const users = [
      {
        email: "admin@example.com",
        fullname: "Carlos Admin",
        password: "password123",
        roles: [adminRole],
      },
      {
        email: "user1@example.com",
        fullname: "María Colaboración",
        password: "password123",
        roles: [colabRole],
      },
      {
        email: "user2@example.com",
        fullname: "Alberto Qualunque",
        password: "password123",
        roles: [],
      }
    ];

    for (const userData of users) {
      const existing = await em.findOne(User, { email: userData.email });

      if (!existing) {
        const user = em.create(User, {
          email: userData.email,
          fullname: userData.fullname,
          password: await bcrypt.hash(userData.password, 10),
        });

        user.roles.set(userData.roles);
      }
    }

    await em.flush();
  }

}
