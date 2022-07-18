import { MigrationInterface, QueryRunner } from 'typeorm';

export class purchaseEntityFixTypo1658102729802 implements MigrationInterface {
  name = 'purchaseEntityFixTypo1658102729802';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "public"."purchases" DROP COLUMN "purchase_id"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "public"."purchases"
            ADD "purchase_id" uuid
        `);
  }
}
