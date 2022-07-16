import { MigrationInterface, QueryRunner } from 'typeorm';

export class userEntity1657965631686 implements MigrationInterface {
  name = 'userEntity1657965631686';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "public"."users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "displayed_name" character varying(16) NOT NULL,
                "login" character varying(16) NOT NULL,
                "password" character varying(256) NOT NULL,
                CONSTRAINT "UQ_32ab990ec2829bffa04c63e6f8d" UNIQUE ("login"),
                CONSTRAINT "PK_a6cc71bedf15a41a5f5ee8aea97" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "public"."users"
        `);
  }
}
