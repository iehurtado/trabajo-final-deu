import { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { BalneariosSeeder } from "./BalneariosSeeder";
import { PuntosInteresSeeder } from "./PuntosInteresSeeder";
import { UsersSeeder } from "./UsersSeeder";

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager, context?: Dictionary | undefined): Promise<void> {
    return this.call(em, [
      UsersSeeder,
      BalneariosSeeder,
      PuntosInteresSeeder,
    ]);
  }
}
