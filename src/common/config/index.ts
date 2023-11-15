import { registerAs } from '@nestjs/config';

export const jwtConstants = {
  secret:
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};
export const baseConfig = registerAs('baseConfig', () => ({
  port: process.env.PORT || 3000,
  db: {
    type: 'mysql',
    synchronize: true, //是否自动同步实体文件,生产环境建议关闭
    logging: true,
    host: 'xxxx',
    port: 3306,
    username: 'xxxx',
    password: 'xxxx',
    database: 'management',
    extra: {
      connectionLimit: 10,
    },
    createSchema: true, // 如果需要创建表
    autoLoadEntities: true,
    createDateColumn: { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' },
    updateDateColumn: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
  },
}));

export const defaultConfig = () => ({
  ...jwtConstants,
  jwtSecret: '1Q2e3W4!4%!!@*^sq123',
  jwtRefreshSecret: 'qwe@s#F43K*&sqw4@^2^21',
});
