import { MigrationInterface, QueryRunner } from 'typeorm';

export class userRole1657972704751 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "public"."roles" ("name") VALUES ('User');
    `);

    const userPermissions = [
      'GET_ITEM_LIST',
      'GET_SELF_ITEMS',
      'GET_ITEM_INFO',
      'MAKE_PURCHASE',
      'GET_HISTORY_OF_PURCHASES',
      'CAN_TRADE',
    ];

    await queryRunner.query(`
        ${userPermissions
          .map((permission) => {
            return `INSERT INTO "public"."permission_roles" ("role_id", "permission_id") VALUES ((SELECT id FROM "public"."roles" WHERE name = 'User'), (SELECT id FROM "public"."permissions" WHERE name = '${permission}'));\n`;
          })
          .join('\n')}
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM "public"."permission_roles" WHERE "role_id" = (SELECT id FROM "public"."roles" WHERE name = 'User');
    `);
    await queryRunner.query(`
        DELETE FROM "public"."roles" WHERE name = 'User';
    `);
  }
}
