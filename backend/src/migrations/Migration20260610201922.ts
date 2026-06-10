import { Migration } from '@mikro-orm/migrations';

export class Migration20260610201922 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`
      delete from "punto_interes" where id not in (
        select min(id)
        from "punto_interes"
        group by nombre
      )
    `)
    this.addSql(`alter table "punto_interes" add constraint "punto_interes_nombre_unique" unique ("nombre");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "punto_interes" drop constraint "punto_interes_nombre_unique";`);
  }

}
