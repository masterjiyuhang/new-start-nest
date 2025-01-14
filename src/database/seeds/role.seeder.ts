import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource, In } from 'typeorm';
import { Role } from 'src/core/role/entities/role.entity';
import { Permission } from 'src/core/permission/entities/permission.entity';
import { roleEnums } from 'src/common/enums/role.enums';
import { permissionEnums } from 'src/common/enums/permission.enums';

export default class RoleSeeder implements Seeder {
  track = false;
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const roleRepository = dataSource.getRepository(Role);
    const permissionRepository = dataSource.getRepository(Permission);

    const roles = [
      {
        name: 'SuperAdmin',
        code: roleEnums.SUPER_ADMIN,
        desc: 'Super Administrator',
        permissions: [
          permissionEnums.USER_VIEW,
          permissionEnums.USER_EDIT,
          permissionEnums.USER_DELETE,
          permissionEnums.ROLE_VIEW,
          permissionEnums.ROLE_EDIT,
          permissionEnums.ROLE_DELETE,
          permissionEnums.DATA_EXPORT,
          permissionEnums.LOG_VIEW,
        ],
      },
      {
        name: 'Admin',
        code: roleEnums.ADMIN,
        desc: 'System Administrator',
        permissions: [
          permissionEnums.USER_VIEW,
          permissionEnums.USER_EDIT,
          permissionEnums.ROLE_VIEW,
        ],
      },
      {
        name: 'User',
        code: roleEnums.USER,
        desc: 'Content User',
        permissions: [
          permissionEnums.USER_VIEW,
          permissionEnums.USER_EDIT,
          permissionEnums.ROLE_VIEW,
          permissionEnums.ROLE_EDIT,
          permissionEnums.DATA_EXPORT,
        ],
      },
      {
        name: 'Viewer',
        code: roleEnums.Viewer,
        desc: 'Content Viewer',
        permissions: [permissionEnums.USER_VIEW],
      },
    ];

    for (const role of roles) {
      const existingRole = await roleRepository.findOne({
        where: { code: role.code + '' },
      });
      if (existingRole) continue;

      // 获取对应的权限
      const permissions = await permissionRepository.find({
        where: { code: In(role.permissions) },
      });

      // 创建新角色并关联权限
      const newRole = roleRepository.create({
        name: role.name, // 角色名称
        code: role.code + '', // 角色代码
        desc: `${role.desc}`,
        permissions,
      });

      await roleRepository.save(newRole);
      console.log(
        `Role ${role.name} created with ${permissions.length} permissions.`,
      );
    }

    // ---------------------------------------------------

    const roleFactory = factoryManager.get(Role);
    console.log(
      '🍉 ~ file: role.seeder.ts:20 ~ UserSeeder ~ roleFactory:',
      roleFactory,
    );

    this.track = true;
    // // save 1 factory generated entity, to the database
    // await roleFactory.save();

    // // save 5 factory generated entities, to the database
    // await roleFactory.saveMany(5);
  }
}
