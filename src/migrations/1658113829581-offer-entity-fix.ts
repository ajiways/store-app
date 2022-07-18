import { MigrationInterface, QueryRunner } from 'typeorm';

export class offerEntityFix1658113829581 implements MigrationInterface {
  name = 'offerEntityFix1658113829581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "public"."offers" DROP CONSTRAINT "FK_1149089c7aafb4e0613f1fa12e0"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers" DROP CONSTRAINT "FK_b5a0ee02a9c975436286bc79e73"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers" DROP COLUMN "user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers" DROP COLUMN "item_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers"
            ADD "user_from_id" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers"
            ADD "user_to_id" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers"
            ADD CONSTRAINT "FK_a4b76d9f09d0b55994ffca3d5b3" FOREIGN KEY ("user_from_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers"
            ADD CONSTRAINT "FK_e3fbcd354b7f77b94368312b2f5" FOREIGN KEY ("user_to_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "public"."offers" DROP CONSTRAINT "FK_e3fbcd354b7f77b94368312b2f5"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers" DROP CONSTRAINT "FK_a4b76d9f09d0b55994ffca3d5b3"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers" DROP COLUMN "user_to_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers" DROP COLUMN "user_from_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers"
            ADD "item_id" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers"
            ADD "user_id" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers"
            ADD CONSTRAINT "FK_b5a0ee02a9c975436286bc79e73" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers"
            ADD CONSTRAINT "FK_1149089c7aafb4e0613f1fa12e0" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
