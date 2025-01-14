import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { resolve } from 'node:path';
import { baseConfig, envConfig } from './index';
import { SeederOptions } from 'typeorm-extension';

async function bootstrap() {
  const env = envConfig[process.env.NODE_ENV] || '.env';
  // console.log('🍉 ~ file: ormconfig.ts:9 ~ bootstrap ~ env:', env);
  dotenv.config({ path: resolve(__dirname, `../../../${env}`) });
}

bootstrap();

const dbConfig: DataSourceOptions = baseConfig().db;
// console.log('🍉 ~ file: ormconfig.ts:17 ~ dbConfig:', dbConfig);

/**
 * pnpm tm 运行typeorm 的migration
 * pnpm tm schema:sync 同步实体和数据库模式
 * pnpm tm schema:lg  查看在同步实体和数据库模式时，数据库会执行哪些具体的 SQL 操作
 * pnpm tm schema:drop 用于删除你默认数据源数据库中的所有表。
 * pnpm run migrate:init 生成初始化数据库的文件 initDb
 * pnpm run migration:generate 生成迁移文件
 *
 */

export const ormconfig: DataSourceOptions & SeederOptions = {
  // type: 'mysql',
  // host: process.env.DATABASE_HOST ?? '192.168.3.75',
  // port: +process.env.DATABASE_PORT ?? 3306,
  // username: process.env.DATABASE_USER ?? 'root',
  // password: process.env.DATABASE_PASSWORD ?? 'b97ac43c76681530',
  // database: process.env.DATABASE_NAME ?? 'management_local',
  // synchronize: false,

  // bigNumberStrings: true,
  // multipleStatements: true,
  // logging: true,
  // entities: ['dist/**/*.entity.js'],
  // migrations: ['dist/**/migrations/*.js'],
  // migrationsTableName: 'migration-history',
  // migrationsRun: true,
  ...dbConfig,
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  factories: ['src/database/factories/**/*{.ts,.js}'],
};

export const dataSource = new DataSource(ormconfig);
