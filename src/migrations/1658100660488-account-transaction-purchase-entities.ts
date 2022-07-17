import { MigrationInterface, QueryRunner } from 'typeorm';

export class accountTransactionPurchaseEntities1658100660488
  implements MigrationInterface
{
  name = 'accountTransactionPurchaseEntities1658100660488';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "public"."accounts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid NOT NULL,
                "balance" integer NOT NULL DEFAULT '0',
                CONSTRAINT "PK_650c26a7da1c44b70a204eb1253" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."transactions_type_enum" AS ENUM('withdraw', 'refill', 'order_payment')
        `);
    await queryRunner.query(`
            CREATE TABLE "public"."transactions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "account_id" uuid NOT NULL,
                "amount" integer NOT NULL,
                "type" "public"."transactions_type_enum" NOT NULL,
                CONSTRAINT "PK_81c60dae871c53962866bb4a5e7" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "public"."purchases" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid NOT NULL,
                "transaction_id" uuid NOT NULL,
                "purchase_id" uuid,
                "price" integer NOT NULL,
                "item_id" uuid NOT NULL,
                CONSTRAINT "PK_7ab0424c8ac176666e4b3aad293" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."transactions"
            ADD CONSTRAINT "FK_b91b38fa87f9a9c10986e3f395b" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."purchases"
            ADD CONSTRAINT "FK_5dda7fe4e8c2182ed517de57aff" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."purchases"
            ADD CONSTRAINT "FK_32841928efeea90b00b81d532e2" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."purchases"
            ADD CONSTRAINT "FK_c00781ef46c71a67e8185fae311" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "public"."purchases" DROP CONSTRAINT "FK_c00781ef46c71a67e8185fae311"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."purchases" DROP CONSTRAINT "FK_32841928efeea90b00b81d532e2"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."purchases" DROP CONSTRAINT "FK_5dda7fe4e8c2182ed517de57aff"
        `);
    await queryRunner.query(`
            ALTER TABLE "public"."transactions" DROP CONSTRAINT "FK_b91b38fa87f9a9c10986e3f395b"
        `);
    await queryRunner.query(`
            DROP TABLE "public"."purchases"
        `);
    await queryRunner.query(`
            DROP TABLE "public"."transactions"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."transactions_type_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "public"."accounts"
        `);
  }
}
