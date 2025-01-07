import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const jwtConstants = {
  secret:
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};

type ZZBZaseConfig = {
  port: number;
  db: TypeOrmModuleOptions;
};
export const envConfig = {
  dev: '.env.dev',
  prod: '.env.prod',
  local: '.env.local',
};

export const baseConfig = registerAs(
  'baseConfig',
  (): ZZBZaseConfig => ({
    port: +process.env.PORT || 3000,
    db: {
      type: 'mysql',
      synchronize: false, //是否自动同步实体文件,生产环境建议关闭
      connectTimeout: 30000,
      database: process.env.DATABASE_NAME,
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      logging: false,
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/**/migrations/*.js'],
      migrationsTableName: 'migration-history',
      migrationsRun: true,
      timezone: '+08:00',
      autoLoadEntities: true,
    },
  }),
);

export const defaultConfig = () => ({
  ...jwtConstants,
  jwtSecret: '1Q2e3W4!4%!!@*^sq123',
  jwtRefreshSecret: 'qwe@s#F43K*&sqw4@^2^21',
});
