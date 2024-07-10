import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDeleteFlag1720577722629 implements MigrationInterface {
    name = 'UpdateDeleteFlag1720577722629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`car_type\` DROP COLUMN \`creatorId\``);
        await queryRunner.query(`ALTER TABLE \`car_type\` DROP COLUMN \`operatorId\``);
        await queryRunner.query(`ALTER TABLE \`car_type\` ADD \`creator_id\` varchar(255) NOT NULL COMMENT '创建人ID'`);
        await queryRunner.query(`ALTER TABLE \`car_type\` ADD \`operator_id\` varchar(255) NOT NULL COMMENT '操作人ID'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`car_type\` DROP COLUMN \`operator_id\``);
        await queryRunner.query(`ALTER TABLE \`car_type\` DROP COLUMN \`creator_id\``);
        await queryRunner.query(`ALTER TABLE \`car_type\` ADD \`operatorId\` varchar(255) NOT NULL COMMENT '操作人ID'`);
        await queryRunner.query(`ALTER TABLE \`car_type\` ADD \`creatorId\` varchar(255) NOT NULL COMMENT '创建人ID'`);
    }

}
