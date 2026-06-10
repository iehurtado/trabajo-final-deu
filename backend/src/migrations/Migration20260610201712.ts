import { Migration } from '@mikro-orm/migrations';

export class Migration20260610201712 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`
      delete from "balneario" where id not in (
        select min(id)
        from "balneario"
        group by nombre
      )
    `)
    this.addSql(`alter table "balneario" add constraint "balneario_nombre_unique" unique ("nombre");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "balneario" drop constraint "balneario_nombre_unique";`);
  }

}
