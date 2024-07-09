import { MigrationInterface, QueryRunner } from "typeorm";

export class Bar1720520335950 implements MigrationInterface {
    name = 'Bar1720520335950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`car\` DROP COLUMN \`platform\``);
        await queryRunner.query(`ALTER TABLE \`car\` DROP COLUMN \`platform_id\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`car\` ADD \`platform_id\` varchar(255) NOT NULL COMMENT '平台id'`);
        await queryRunner.query(`ALTER TABLE \`car\` ADD \`platform\` varchar(255) NOT NULL COMMENT '平台名称'`);
    }

}
