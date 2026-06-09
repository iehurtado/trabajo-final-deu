import { Migration } from '@mikro-orm/migrations';

export class Migration20260609031626 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "punto_interes" ("id" serial primary key, "nombre" varchar(255) not null, "latitud" real not null, "longitud" real not null, "categoria" varchar(255) not null, "subcategoria" varchar(255) not null, "descripcion" varchar(255) null);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "punto_interes" cascade;`);
  }

}
