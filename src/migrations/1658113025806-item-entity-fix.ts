import { MigrationInterface, QueryRunner } from 'typeorm';

export class itemEntityFix1658113025806 implements MigrationInterface {
  name = 'itemEntityFix1658113025806';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "public"."items" DROP COLUMN "in_trade"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."inventory_items"
            ADD "in_trade" boolean NOT NULL DEFAULT false
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "public"."inventory_items" DROP COLUMN "in_trade"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."items"
            ADD "in_trade" boolean NOT NULL DEFAULT false
        `);
  }
}
