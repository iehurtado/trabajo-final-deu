import { defineConfig, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import { User } from "./entities";

export default defineConfig({
  driver: PostgreSqlDriver,
  extensions: [Migrator],
  entities: [User],
  dbName: 'postgres',
  host: 'localhost',
  port: 5432,
  password: 'password', // TODO cambiar para usar .env
})
