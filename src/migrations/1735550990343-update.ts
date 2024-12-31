import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1735550990343 implements MigrationInterface {
  name = 'Update1735550990343';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`openid\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`wechatNickname\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`wechatAvatar\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`username\` \`username\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`password\` \`password\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`email\` \`email\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`email\` \`email\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`password\` \`password\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`username\` \`username\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`wechatAvatar\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`wechatNickname\``,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`openid\``);
  }
}
