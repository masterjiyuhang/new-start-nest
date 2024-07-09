import { MigrationInterface, QueryRunner } from "typeorm";

export class Bar1720520242637 implements MigrationInterface {
    name = 'Bar1720520242637'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`car\` ADD \`platform\` varchar(255) NOT NULL COMMENT '平台名称'`);
        await queryRunner.query(`ALTER TABLE \`car\` ADD \`platform_id\` varchar(255) NOT NULL COMMENT '平台id'`);
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`transmission\` \`transmission\` enum ('0', '1', '2') NOT NULL COMMENT '1: 自动， 2: 手动  3:未知'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`transmission\` \`transmission\` enum ('0', '1', '2') NOT NULL COMMENT '1: 自动， 2: 手动'`);
        await queryRunner.query(`ALTER TABLE \`car\` DROP COLUMN \`platform_id\``);
        await queryRunner.query(`ALTER TABLE \`car\` DROP COLUMN \`platform\``);
    }

}
