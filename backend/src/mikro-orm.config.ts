import { defineConfig, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import { Balneario, PuntoInteres, Rol, User } from "./entities";
import { SeedManager } from "@mikro-orm/seeder";

export default defineConfig({
  driver: PostgreSqlDriver,
  extensions: [Migrator, SeedManager],
  entities: [Balneario, PuntoInteres, Rol, User],
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
  seeder: {
    path: 'dist/seeders',
    pathTs: 'src/seeders',
    defaultSeeder: 'DatabaseSeeder',
  },
  dbName: process.env.DB_NAME ?? 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'password',
})
