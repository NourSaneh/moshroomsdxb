import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_text" ADD COLUMN "intro_kicker" varchar;
  ALTER TABLE "site_text" ADD COLUMN "intro_headline" varchar;
  ALTER TABLE "site_text" ADD COLUMN "intro_outro" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_text" DROP COLUMN "intro_kicker";
  ALTER TABLE "site_text" DROP COLUMN "intro_headline";
  ALTER TABLE "site_text" DROP COLUMN "intro_outro";`)
}
