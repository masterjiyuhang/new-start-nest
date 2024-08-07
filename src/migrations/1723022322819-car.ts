import { MigrationInterface, QueryRunner } from "typeorm";

export class Car1723022322819 implements MigrationInterface {
    name = 'Car1723022322819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`platform\` \`platform\` varchar(255) NOT NULL COMMENT '售卖平台名称' DEFAULT '大白菜'`);
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`platform_id\` \`platform_id\` varchar(255) NOT NULL COMMENT '售卖平台id' DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`platform_id\` \`platform_id\` varchar(255) NOT NULL COMMENT '售卖平台id'`);
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`platform\` \`platform\` varchar(255) NOT NULL COMMENT '售卖平台名称'`);
    }

}
