import { Migration } from '@mikro-orm/migrations';

export class Migration20260609034300 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "rol" ("id" serial primary key, "nombre" varchar(255) not null);`);
    this.addSql(`alter table "rol" add constraint "rol_nombre_unique" unique ("nombre");`);

    this.addSql(`create table "user_roles" ("user_id" int not null, "rol_id" int not null, primary key ("user_id", "rol_id"));`);

    this.addSql(`alter table "user_roles" add constraint "user_roles_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "user_roles" add constraint "user_roles_rol_id_foreign" foreign key ("rol_id") references "rol" ("id") on update cascade on delete cascade;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "user_roles" drop constraint "user_roles_rol_id_foreign";`);

    this.addSql(`drop table if exists "rol" cascade;`);
    this.addSql(`drop table if exists "user_roles" cascade;`);
  }

}
