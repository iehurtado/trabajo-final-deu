import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Balneario } from 'src/entities';

export class DatabaseSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    const balnearios = [
      {
        id: 1,
        nombre: "Balneario Municipal Punta Lara",
        latitud: -34.821, longitud: -57.968,
        estadoAgua: "APTO" as const,
        auxilio: true, banos: true, rampa: true, vigilancia: true, parrillas: true, bus: true
      },
      {
        id: 2,
        nombre: "Playa La Balandra",
        latitud: -34.920, longitud: -57.780,
        estadoAgua: "PRECAUCION" as const,
        auxilio: true, banos: true, rampa: false, vigilancia: true, parrillas: true, bus: true
      },
      {
        id: 3,
        nombre: "Playa Bagliardi",
        latitud: -34.875, longitud: -57.810,
        estadoAgua: "NO_APTO" as const,
        auxilio: false, banos: false, rampa: false, vigilancia: false, parrillas: true, bus: false
      }
    ];

    for (const balneario of balnearios) {
      em.create(Balneario, balneario);
    }

    await em.flush();
  }

}
