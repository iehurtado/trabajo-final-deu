import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User, Rol } from 'src/entities';

export class UsersSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    // First ensure roles exist
    const roles = [
      { id: 1, nombre: "Administrador" },
      { id: 2, nombre: "Colaborador" },
    ];

    for (const roleData of roles) {
      const existing = await em.findOne(Rol, { id: roleData.id });
      if (!existing) {
        em.create(Rol, roleData);
      }
    }

    const adminRole = await em.findOneOrFail(Rol, { nombre: "Administrador" });
    const colabRole = await em.findOneOrFail(Rol, { nombre: "Colaborador" });

    const users = [
      {
        id: 1,
        email: "admin@example.com",
        fullname: "Admin User",
        password: "hashedPassword123",
        roles: [adminRole],
      },
      {
        id: 2,
        email: "user1@example.com",
        fullname: "John Doe",
        password: "hashedPassword456",
        roles: [colabRole],
      },
      {
        id: 3,
        email: "user2@example.com",
        fullname: "Jane Smith",
        password: "hashedPassword789",
        roles: [colabRole],
      }
    ];

    for (const userData of users) {
      const existing = await em.findOne(User, { id: userData.id });
      if (!existing) {
        const user = em.create(User, {
          email: userData.email,
          fullname: userData.fullname,
          password: userData.password,
        });

        user.roles.set(userData.roles);
      }
    }

    await em.flush();
  }

}
