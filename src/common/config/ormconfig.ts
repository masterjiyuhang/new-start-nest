import { DataSource, DataSourceOptions } from 'typeorm';

export const ormconfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST ?? '192.168.3.75',
  port: +process.env.DATABASE_PORT ?? 3306,
  username: process.env.DATABASE_USER ?? 'root',
  password: process.env.DATABASE_PASSWORD ?? 'b97ac43c76681530',
  database: process.env.DATABASE_NAME ?? 'management_local',
  synchronize: false,
  bigNumberStrings: true,
  multipleStatements: true,
  logging: true,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/**/migrations/*.js'],
  migrationsTableName: 'migration-history',
  migrationsRun: true,
};

export const dataSource = new DataSource(ormconfig);
