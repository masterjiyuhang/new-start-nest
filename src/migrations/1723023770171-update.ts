import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1723023770171 implements MigrationInterface {
    name = 'Update1723023770171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`transmission\` \`transmission\` enum ('0', '1', '2') NOT NULL COMMENT '1:自动 2:手动 3:未知'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`transmission\` \`transmission\` enum ('0', '1', '2') NOT NULL COMMENT '1: 自动 2: 手动  3:未知'`);
    }

}
