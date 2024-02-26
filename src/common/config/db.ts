export const db = {
  type: 'mysql',
  synchronize: true, //是否自动同步实体文件,生产环境建议关闭
  logging: true,
  host: '127.0.0.1',
  port: 3306,
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '123456',
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
  timezone: '+08:00',
};
