import { defineConfig, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import { Balneario, PuntoInteres, Rol, User } from "./entities";
import { SeedManager } from "@mikro-orm/seeder";

export default defineConfig({
  driver: PostgreSqlDriver,
  extensions: [Migrator, SeedManager],
  entities: [Balneario, PuntoInteres, Rol, User],
  dbName: 'postgres',
  host: 'localhost',
  port: 5432,
  password: 'password', // TODO cambiar para usar .env
})
