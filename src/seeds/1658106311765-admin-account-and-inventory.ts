import { MigrationInterface, QueryRunner } from 'typeorm';

export class adminAccountAndInventory1658106311765
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "public"."accounts" ("user_id", "balance") VALUES ((SELECT id FROM "public"."users" WHERE login = 'admin'), '100000');
    `);
    await queryRunner.query(`
        INSERT INTO "public"."inventories" ("user_id") VALUES ((SELECT id FROM "public"."users" WHERE login = 'admin'));
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM "public"."accounts" WHERE "user_id" = (SELECT id FROM "public"."users" WHERE login = 'admin');
    `);
    await queryRunner.query(`
        DELETE FROM "public"."inventories"  WHERE "user_id" = (SELECT id FROM "public"."users" WHERE login = 'admin');
    `);
  }
}
