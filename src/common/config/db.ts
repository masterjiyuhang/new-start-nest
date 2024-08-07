export const db = {
  type: 'mysql',
  synchronize: false, //是否自动同步实体文件,生产环境建议关闭
  logging: false,
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'management',
  extra: {
    connectionLimit: 3,
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
