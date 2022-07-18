import { MigrationInterface, QueryRunner } from 'typeorm';

export class offerEntityFix1658112868267 implements MigrationInterface {
  name = 'offerEntityFix1658112868267';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "public"."offers"
                RENAME COLUMN "item_ids" TO "items_and_prices"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers" DROP COLUMN "items_and_prices"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers"
            ADD "items_and_prices" jsonb NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "public"."offers" DROP COLUMN "items_and_prices"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers"
            ADD "items_and_prices" uuid array NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers"
                RENAME COLUMN "items_and_prices" TO "item_ids"
        `);
  }
}
