import { MigrationInterface, QueryRunner } from 'typeorm';

export class adminRolePermissions1657969566637 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const permissions = [
      'GET_ITEM_LIST',
      'GET_SELF_ITEMS',
      'GET_ADMIN_ITEMS_LIST',
      'GET_ITEM_INFO',
      'CREATE_ITEM',
      'EDIT_ITEM',
      'MAKE_PURCHASE',
      'GET_HISTORY_OF_PURCHASES',
      'CAN_TRADE',
    ];

    await queryRunner.query(`
          ${permissions
            .map((permission) => {
              return `INSERT INTO "public"."permission_roles" ("role_id", "permission_id") VALUES ((SELECT id FROM "public"."roles" WHERE name = 'Admin'), (SELECT id FROM "public"."permissions" WHERE name = '${permission}'));\n`;
            })
            .join('\n')}
      `);
    await queryRunner.query(`
            INSERT INTO "public"."user_roles" ("user_id", "role_id") VALUES ((SELECT id FROM "public"."users" WHERE login = 'admin'), (SELECT id FROM "public"."roles" WHERE name = 'Admin'));
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM "public"."permissions";
    `);
    await queryRunner.query(`
        DELETE FROM "public"."permission_roles";
    `);
    await queryRunner.query(`
        DELETE FROM "public"."user_roles";
    `);
  }
}
