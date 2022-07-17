import { MigrationInterface, QueryRunner } from 'typeorm';

export class itemEntity1658069670484 implements MigrationInterface {
  name = 'itemEntity1658069670484';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."items_type_enum" AS ENUM('common', 'rare', 'mythic', 'legendary')
        `);
    await queryRunner.query(`
            CREATE TABLE "public"."items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying(32) NOT NULL,
                "description" character varying(256) NOT NULL,
                "price" integer NOT NULL,
                "images" character varying array NOT NULL,
                "enabled" boolean NOT NULL,
                "type" "public"."items_type_enum" NOT NULL,
                CONSTRAINT "PK_d32973b37cfbe9098d4722f564a" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "public"."items"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."items_type_enum"
        `);
  }
}
