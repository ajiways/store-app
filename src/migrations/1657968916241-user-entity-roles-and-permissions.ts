import { MigrationInterface, QueryRunner } from 'typeorm';

export class userEntityRolesAndPermissions1657968916241
  implements MigrationInterface
{
  name = 'userEntityRolesAndPermissions1657968916241';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."permissions_permission_enum" AS ENUM(
                'get_item_list',
                'get_self_items',
                'get_admin_items_list',
                'get_item_info',
                'create_item',
                'edit_item',
                'make_purchase',
                'get_history_of_purchases',
                'can_trade'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "public"."permissions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying(32) NOT NULL,
                "permission" "public"."permissions_permission_enum" NOT NULL,
                CONSTRAINT "PK_f0f9bb265f21bfc7ad206ad2e97" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "public"."roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying(32) NOT NULL,
                CONSTRAINT "PK_130f0eec948cd435a779de3a4f0" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "public"."permission_roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "permission_id" uuid NOT NULL,
                "role_id" uuid NOT NULL,
                CONSTRAINT "PK_da0ca1ee59c6acd9574391b86bd" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "public"."users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "displayed_name" character varying(16) NOT NULL,
                "login" character varying(16) NOT NULL,
                "password" character varying(256) NOT NULL,
                CONSTRAINT "UQ_32ab990ec2829bffa04c63e6f8d" UNIQUE ("login"),
                CONSTRAINT "PK_a6cc71bedf15a41a5f5ee8aea97" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "public"."user_roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid NOT NULL,
                "role_id" uuid NOT NULL,
                CONSTRAINT "PK_2f708d6869058302a83e1f373fa" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."permission_roles"
            ADD CONSTRAINT "FK_cb7d4ce1a73c28c8e082148b6f5" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."permission_roles"
            ADD CONSTRAINT "FK_476305ba97f1c49dbf8c054a823" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."user_roles"
            ADD CONSTRAINT "FK_2571274dc6390295cbd14b5338b" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."user_roles"
            ADD CONSTRAINT "FK_c9c1a14db69da53f26fc4330102" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "public"."user_roles" DROP CONSTRAINT "FK_c9c1a14db69da53f26fc4330102"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."user_roles" DROP CONSTRAINT "FK_2571274dc6390295cbd14b5338b"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."permission_roles" DROP CONSTRAINT "FK_476305ba97f1c49dbf8c054a823"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."permission_roles" DROP CONSTRAINT "FK_cb7d4ce1a73c28c8e082148b6f5"
        `);
    await queryRunner.query(`
            DROP TABLE "public"."user_roles"
        `);
    await queryRunner.query(`
            DROP TABLE "public"."users"
        `);
    await queryRunner.query(`
            DROP TABLE "public"."permission_roles"
        `);
    await queryRunner.query(`
            DROP TABLE "public"."roles"
        `);
    await queryRunner.query(`
            DROP TABLE "public"."permissions"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."permissions_permission_enum"
        `);
  }
}
