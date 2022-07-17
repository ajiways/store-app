import { MigrationInterface, QueryRunner } from 'typeorm';

export class inventoryEntities1658092699214 implements MigrationInterface {
  name = 'inventoryEntities1658092699214';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "public"."inventories" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid NOT NULL,
                CONSTRAINT "PK_5a78f51ea37aa74053d992ec603" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "public"."inventory_items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "inventory_id" uuid NOT NULL,
                "item_id" uuid NOT NULL,
                CONSTRAINT "PK_ee5e52aeb9644e2fda5f728f428" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."inventory_items"
            ADD CONSTRAINT "FK_f129d5e85b28e5b54bd762c0c03" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."inventory_items"
            ADD CONSTRAINT "FK_590f1dcb35e3188ada9f1135296" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "public"."inventory_items" DROP CONSTRAINT "FK_590f1dcb35e3188ada9f1135296"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."inventory_items" DROP CONSTRAINT "FK_f129d5e85b28e5b54bd762c0c03"
        `);
    await queryRunner.query(`
            DROP TABLE "public"."inventory_items"
        `);
    await queryRunner.query(`
            DROP TABLE "public"."inventories"
        `);
  }
}
