import { MigrationInterface, QueryRunner } from "typeorm";

export class Permission1723085573589 implements MigrationInterface {
    name = 'Permission1723085573589'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`permission\` ADD \`creator_id\` varchar(255) NOT NULL COMMENT '创建人ID'`);
        await queryRunner.query(`ALTER TABLE \`permission\` ADD \`operator_id\` varchar(255) NOT NULL COMMENT '操作人ID'`);
        await queryRunner.query(`ALTER TABLE \`permission\` ADD \`delete_flag\` int NOT NULL COMMENT '0: 正常, 1: 已删除' DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`permission\` DROP COLUMN \`delete_flag\``);
        await queryRunner.query(`ALTER TABLE \`permission\` DROP COLUMN \`operator_id\``);
        await queryRunner.query(`ALTER TABLE \`permission\` DROP COLUMN \`creator_id\``);
    }

}
