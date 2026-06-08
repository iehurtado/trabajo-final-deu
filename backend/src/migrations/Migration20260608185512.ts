import { Migration } from '@mikro-orm/migrations';

export class Migration20260608185512 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "balneario" ("id" serial primary key, "nombre" varchar(255) not null, "latitud" real not null, "longitud" real not null, "estado_agua" text not null, "auxilio" boolean not null, "banos" boolean not null, "rampa" boolean not null, "vigilancia" boolean not null, "parrillas" boolean not null, "bus" boolean not null);`);

    this.addSql(`alter table "balneario" add constraint "balneario_estado_agua_check" check ("estado_agua" in ('APTO', 'PRECAUCION', 'NO_APTO'));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "balneario" cascade;`);
  }

}
