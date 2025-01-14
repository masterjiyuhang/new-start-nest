import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1736841668017 implements MigrationInterface {
  name = 'Update1736841668017';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`permission\` ADD \`code\` varchar(150) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`permission\` DROP COLUMN \`name\``);
    await queryRunner.query(
      `ALTER TABLE \`permission\` ADD \`name\` varchar(150) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`permission\` DROP COLUMN \`name\``);
    await queryRunner.query(
      `ALTER TABLE \`permission\` ADD \`name\` varchar(50) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`permission\` DROP COLUMN \`code\``);
  }
}
