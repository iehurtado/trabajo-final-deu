import { Migration } from '@mikro-orm/migrations';

export class Migration20260630182142 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table "balneario" add "created_at" timestamptz not null default current_timestamp, add "updated_at" timestamptz not null default current_timestamp;`);

    this.addSql(`alter table "punto_interes" add "created_at" timestamptz not null default current_timestamp, add "updated_at" timestamptz not null default current_timestamp;`);

    this.addSql(`alter table "user" add "created_at" timestamptz not null default current_timestamp, add "updated_at" timestamptz not null default current_timestamp;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "balneario" drop column "created_at", drop column "updated_at";`);

    this.addSql(`alter table "punto_interes" drop column "created_at", drop column "updated_at";`);

    this.addSql(`alter table "user" drop column "created_at", drop column "updated_at";`);
  }

}
