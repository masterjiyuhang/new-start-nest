import { roleEnums } from 'src/common/enums/role.enums';
import { hashPassword } from 'src/common/utils/bcrypt';
import { Role } from 'src/core/role/entities/role.entity';
import { User } from 'src/core/user/entities/user.entity';
import { DataSource, In } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class SuperAdminSeeder implements Seeder {
  track = false;
  public async run(dataSource: DataSource): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);
    try {
      // 检查超级管理员角色是否存在
      const roles = await roleRepository.find({
        where: {
          code: In([roleEnums.SUPER_ADMIN]),
        },
      });

      if (roles.length === 0) {
        console.error(
          'Error: SUPER_ADMIN role not found. Please ensure the role is seeded first.',
        );
        return;
      }

      // 检查超级管理员用户是否已存在
      const existingUser = await userRepository.findOne({
        where: { username: 'superAdmin' },
      });

      if (existingUser) {
        console.log('Super admin already exists. Skipping creation.');
        return;
      }

      // 创建超级管理员用户
      const user = userRepository.create({
        id: 500001, // 确保 ID 不与现有用户冲突
        username: 'superAdmin',
        password: hashPassword('admin@123'), // 初始密码，请提醒用户尽快更改
        email: 'syjzjyh@163.com', // 可选字段
        roles: roles,
      });

      // 保存用户到数据库
      await userRepository.save(user);

      console.log('Super admin created successfully:');
    } catch (error) {
      console.error('An error occurred while creating the super admin:', error);
    }

    // 设置追踪标志
    this.track = true;
  }
}
