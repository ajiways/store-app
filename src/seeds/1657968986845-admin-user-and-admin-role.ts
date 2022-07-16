import { MigrationInterface, QueryRunner } from 'typeorm';

export class adminUserAndAdminRole1657968986845 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "public"."users" ("displayed_name", "login", "password") VALUES ('Admin', 'admin', '$2a$07$glPEJOIFguDSXBDlvZMIleb8M85BkvIqa2wCSYmx3PmO7xo0JZ82G');
    `);
    // pass - admin
    await queryRunner.query(`
        INSERT INTO "public"."roles" ("name") VALUES ('Admin');
    `);

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
          .map(
            (permission) =>
              `INSERT INTO "public"."permissions" ("name", "permission") VALUES ('${permission}', '${permission.toLowerCase()}');\n`,
          )
          .join('\n')}
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM "public"."users" WHERE login = 'admin';
    `);
    await queryRunner.query(`
        DELETE FROM "public"."roles" WHERE name = 'Admin';
    `);
  }
}
