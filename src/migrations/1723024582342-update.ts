import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1723024582342 implements MigrationInterface {
    name = 'Update1723024582342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`platform_id\` \`platform_id\` varchar(255) NOT NULL COMMENT '售卖平台Id' DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`platform_id\` \`platform_id\` varchar(255) NOT NULL COMMENT '售卖平台id' DEFAULT '1'`);
    }

}
