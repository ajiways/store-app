import { MigrationInterface, QueryRunner } from 'typeorm';

export class offerEntity1658111041092 implements MigrationInterface {
  name = 'offerEntity1658111041092';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "public"."purchases" DROP CONSTRAINT "FK_c00781ef46c71a67e8185fae311"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."offers_status_enum" AS ENUM(
                'waiting',
                'accepted_and_closed',
                'declined_and_closed'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "public"."offers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid NOT NULL,
                "item_ids" uuid array NOT NULL,
                "status" "public"."offers_status_enum" NOT NULL,
                "item_id" uuid NOT NULL,
                CONSTRAINT "PK_b9a1cd01c4cec8ea8433acafccd" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."items"
            ADD "in_trade" boolean NOT NULL DEFAULT false
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers"
            ADD CONSTRAINT "FK_1149089c7aafb4e0613f1fa12e0" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers"
            ADD CONSTRAINT "FK_b5a0ee02a9c975436286bc79e73" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "public"."offers" DROP CONSTRAINT "FK_b5a0ee02a9c975436286bc79e73"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."offers" DROP CONSTRAINT "FK_1149089c7aafb4e0613f1fa12e0"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."items" DROP COLUMN "in_trade"
        `);
    await queryRunner.query(`
            DROP TABLE "public"."offers"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."offers_status_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."purchases"
            ADD CONSTRAINT "FK_c00781ef46c71a67e8185fae311" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
