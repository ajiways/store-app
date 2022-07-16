import { MigrationInterface, QueryRunner } from 'typeorm';

export class refreshTokenEntity1657982312108 implements MigrationInterface {
  name = 'refreshTokenEntity1657982312108';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "public"."refresh_tokens" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid NOT NULL,
                "refresh_token" character varying NOT NULL,
                CONSTRAINT "PK_31be789dd2de8b435f059b18a57" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."refresh_tokens"
            ADD CONSTRAINT "FK_925c280b45e723eea4f31c1253c" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "public"."refresh_tokens" DROP CONSTRAINT "FK_925c280b45e723eea4f31c1253c"
        `);
    await queryRunner.query(`
            DROP TABLE "public"."refresh_tokens"
        `);
  }
}
