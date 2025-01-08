import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1736300596679 implements MigrationInterface {
    name = 'Update1736300596679'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`car\` ADD \`vin\` varchar(50) NOT NULL COMMENT '车辆车架号'`);
        await queryRunner.query(`ALTER TABLE \`car\` ADD UNIQUE INDEX \`IDX_e917bf949f80860e817b74006e\` (\`vin\`)`);
        await queryRunner.query(`ALTER TABLE \`car\` ADD \`registration_date\` date NOT NULL COMMENT '首次登记日期'`);
        await queryRunner.query(`ALTER TABLE \`car\` ADD \`fuel_type\` enum ('0', '1', '2', '3', '4') NOT NULL COMMENT '未知 = 0, 汽油 = 1, 柴油 = 2, 电动 = 3,混合动力 = 4' DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`title\` \`title\` varchar(30) NOT NULL COMMENT '车辆名称'`);
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`city\` \`city\` varchar(30) NOT NULL COMMENT '上牌城市'`);
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`years\` \`years\` int NOT NULL COMMENT '年份'`);
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`color\` \`color\` varchar(30) NOT NULL COMMENT '车辆颜色'`);
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`transmission\` \`transmission\` enum ('0', '1', '2') NOT NULL COMMENT '0:未知 1:自动 2:手动' DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`is_over_load\` \`is_over_load\` tinyint NOT NULL COMMENT '是否事故'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`is_over_load\` \`is_over_load\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`transmission\` \`transmission\` enum ('0', '1', '2') NOT NULL COMMENT '1:自动 2:手动 3:未知'`);
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`color\` \`color\` varchar(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`years\` \`years\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`city\` \`city\` varchar(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`car\` CHANGE \`title\` \`title\` varchar(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`car\` DROP COLUMN \`fuel_type\``);
        await queryRunner.query(`ALTER TABLE \`car\` DROP COLUMN \`registration_date\``);
        await queryRunner.query(`ALTER TABLE \`car\` DROP INDEX \`IDX_e917bf949f80860e817b74006e\``);
        await queryRunner.query(`ALTER TABLE \`car\` DROP COLUMN \`vin\``);
    }

}
