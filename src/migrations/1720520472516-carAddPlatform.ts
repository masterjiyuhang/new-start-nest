import { MigrationInterface, QueryRunner } from "typeorm";

export class CarAddPlatform1720520472516 implements MigrationInterface {
    name = 'CarAddPlatform1720520472516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`car\` ADD \`platform\` varchar(255) NOT NULL COMMENT '售卖平台名称'`);
        await queryRunner.query(`ALTER TABLE \`car\` ADD \`platform_id\` varchar(255) NOT NULL COMMENT '售卖平台id'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`car\` DROP COLUMN \`platform_id\``);
        await queryRunner.query(`ALTER TABLE \`car\` DROP COLUMN \`platform\``);
    }

}
