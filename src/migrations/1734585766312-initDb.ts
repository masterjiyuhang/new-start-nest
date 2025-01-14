import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDb1734585766312 implements MigrationInterface {
  name = 'InitDb1734585766312';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`permission\` (\`create_time\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`update_time\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_time\` timestamp(6) NULL, \`creator_id\` varchar(255) NOT NULL COMMENT '创建人ID', \`operator_id\` varchar(255) NOT NULL COMMENT '操作人ID', \`delete_flag\` int NOT NULL COMMENT '0: 正常, 1: 已删除' DEFAULT '0', \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`desc\` varchar(100) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`question\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`text\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`dog\` (\`create_time\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`update_time\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_time\` timestamp(6) NULL, \`id\` varchar(36) NOT NULL, \`name\` varchar(30) NOT NULL, \`age\` int NOT NULL, \`breed\` varchar(30) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role\` (\`create_time\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`update_time\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_time\` timestamp(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(20) NOT NULL, \`code\` varchar(32) NOT NULL, \`desc\` varchar(20) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`create_time\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`update_time\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_time\` timestamp(6) NULL, \`id\` varchar(36) NOT NULL, \`username\` varchar(30) NOT NULL, \`email\` varchar(25) NOT NULL, \`password\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_member_relation\` (\`create_time\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`update_time\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_time\` timestamp(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT COMMENT '主键ID', \`user_id\` varchar(255) NOT NULL COMMENT '用户ID', \`member_id\` int NOT NULL COMMENT '会员ID', \`order\` int NOT NULL, \`service_start_time\` timestamp NULL COMMENT '会员服务开始时间', \`service_end_time\` timestamp NULL COMMENT '会员服务结束时间', \`version\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`member\` (\`create_time\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`update_time\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_time\` timestamp(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`member_name\` varchar(32) NOT NULL COMMENT '会员名称', \`member_code\` varchar(16) NOT NULL COMMENT '会员编码', \`member_desc\` varchar(255) NOT NULL COMMENT '会员描述', \`delete_flag\` int NOT NULL DEFAULT '0', \`version\` int NOT NULL COMMENT '乐观锁', \`member_status\` varchar(255) NOT NULL COMMENT '会员状态 1:启用 2: 关闭' DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`car_type\` (\`create_time\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`update_time\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_time\` timestamp(6) NULL, \`creator_id\` varchar(255) NOT NULL COMMENT '创建人ID', \`operator_id\` varchar(255) NOT NULL COMMENT '操作人ID', \`delete_flag\` int NOT NULL COMMENT '0: 正常, 1: 已删除' DEFAULT '0', \`id\` int NOT NULL AUTO_INCREMENT, \`car_type_name\` varchar(20) NOT NULL, \`car_type_code\` varchar(32) NOT NULL, \`car_type_desc\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`car\` (\`create_time\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`update_time\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_time\` timestamp(6) NULL, \`id\` varchar(36) NOT NULL, \`title\` varchar(30) NOT NULL, \`city\` varchar(30) NOT NULL, \`years\` int NOT NULL, \`color\` varchar(30) NOT NULL, \`transmission\` enum ('0', '1', '2') NOT NULL COMMENT '1:自动 2:手动 3:未知', \`is_over_load\` tinyint NOT NULL, \`platform\` varchar(255) NOT NULL COMMENT '售卖平台名称' DEFAULT '大白菜', \`platform_id\` varchar(255) NOT NULL COMMENT '售卖平台Id' DEFAULT '1', \`delete_flag\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`question_categories_category\` (\`questionId\` int NOT NULL, \`categoryId\` int NOT NULL, INDEX \`IDX_21433e6d9a0e7e79c36b4ae69f\` (\`questionId\`), INDEX \`IDX_9cf04f10454634f887ade56562\` (\`categoryId\`), PRIMARY KEY (\`questionId\`, \`categoryId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role_permission_relation\` (\`roleId\` int NOT NULL, \`permissionId\` int NOT NULL, INDEX \`IDX_e1ca88973e6058882146e25401\` (\`roleId\`), INDEX \`IDX_7822b319e3e15d982d49aa50cf\` (\`permissionId\`), PRIMARY KEY (\`roleId\`, \`permissionId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_role_relation\` (\`userId\` varchar(36) NOT NULL, \`roleId\` int NOT NULL, INDEX \`IDX_387a09a362c32ee04b33fc4eaa\` (\`userId\`), INDEX \`IDX_bed18db98a78c46f0bcfedfe65\` (\`roleId\`), PRIMARY KEY (\`userId\`, \`roleId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`car_type_relation\` (\`carId\` varchar(36) NOT NULL, \`carTypeId\` int NOT NULL, INDEX \`IDX_ac1ef5ef045c9913934d05bc5c\` (\`carId\`), INDEX \`IDX_1078ac28f8be8cfc99a81ee213\` (\`carTypeId\`), PRIMARY KEY (\`carId\`, \`carTypeId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_member_relation\` ADD CONSTRAINT \`FK_5d5b00d8fa1b6dba08261ff09c7\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_member_relation\` ADD CONSTRAINT \`FK_229b8a5595b0a676630edd1de19\` FOREIGN KEY (\`member_id\`) REFERENCES \`member\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`question_categories_category\` ADD CONSTRAINT \`FK_21433e6d9a0e7e79c36b4ae69fd\` FOREIGN KEY (\`questionId\`) REFERENCES \`question\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`question_categories_category\` ADD CONSTRAINT \`FK_9cf04f10454634f887ade565622\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permission_relation\` ADD CONSTRAINT \`FK_e1ca88973e6058882146e254018\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permission_relation\` ADD CONSTRAINT \`FK_7822b319e3e15d982d49aa50cf2\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permission\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_relation\` ADD CONSTRAINT \`FK_387a09a362c32ee04b33fc4eaab\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_relation\` ADD CONSTRAINT \`FK_bed18db98a78c46f0bcfedfe652\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`car_type_relation\` ADD CONSTRAINT \`FK_ac1ef5ef045c9913934d05bc5c6\` FOREIGN KEY (\`carId\`) REFERENCES \`car\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`car_type_relation\` ADD CONSTRAINT \`FK_1078ac28f8be8cfc99a81ee2131\` FOREIGN KEY (\`carTypeId\`) REFERENCES \`car_type\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`car_type_relation\` DROP FOREIGN KEY \`FK_1078ac28f8be8cfc99a81ee2131\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`car_type_relation\` DROP FOREIGN KEY \`FK_ac1ef5ef045c9913934d05bc5c6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_relation\` DROP FOREIGN KEY \`FK_bed18db98a78c46f0bcfedfe652\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_relation\` DROP FOREIGN KEY \`FK_387a09a362c32ee04b33fc4eaab\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permission_relation\` DROP FOREIGN KEY \`FK_7822b319e3e15d982d49aa50cf2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permission_relation\` DROP FOREIGN KEY \`FK_e1ca88973e6058882146e254018\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`question_categories_category\` DROP FOREIGN KEY \`FK_9cf04f10454634f887ade565622\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`question_categories_category\` DROP FOREIGN KEY \`FK_21433e6d9a0e7e79c36b4ae69fd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_member_relation\` DROP FOREIGN KEY \`FK_229b8a5595b0a676630edd1de19\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_member_relation\` DROP FOREIGN KEY \`FK_5d5b00d8fa1b6dba08261ff09c7\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_1078ac28f8be8cfc99a81ee213\` ON \`car_type_relation\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_ac1ef5ef045c9913934d05bc5c\` ON \`car_type_relation\``,
    );
    await queryRunner.query(`DROP TABLE \`car_type_relation\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_bed18db98a78c46f0bcfedfe65\` ON \`user_role_relation\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_387a09a362c32ee04b33fc4eaa\` ON \`user_role_relation\``,
    );
    await queryRunner.query(`DROP TABLE \`user_role_relation\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_7822b319e3e15d982d49aa50cf\` ON \`role_permission_relation\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e1ca88973e6058882146e25401\` ON \`role_permission_relation\``,
    );
    await queryRunner.query(`DROP TABLE \`role_permission_relation\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_9cf04f10454634f887ade56562\` ON \`question_categories_category\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_21433e6d9a0e7e79c36b4ae69f\` ON \`question_categories_category\``,
    );
    await queryRunner.query(`DROP TABLE \`question_categories_category\``);
    await queryRunner.query(`DROP TABLE \`car\``);
    await queryRunner.query(`DROP TABLE \`car_type\``);
    await queryRunner.query(`DROP TABLE \`member\``);
    await queryRunner.query(`DROP TABLE \`user_member_relation\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`role\``);
    await queryRunner.query(`DROP TABLE \`dog\``);
    await queryRunner.query(`DROP TABLE \`question\``);
    await queryRunner.query(`DROP TABLE \`category\``);
    await queryRunner.query(`DROP TABLE \`permission\``);
  }
}
