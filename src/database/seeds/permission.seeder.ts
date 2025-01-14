import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Permission } from 'src/core/permission/entities/permission.entity';
import { permissionEnums } from 'src/common/enums/permission.enums';

export default class PermissionSeeder implements Seeder {
  track = false;
  public async run(dataSource: DataSource): Promise<any> {
    const permissionRepository = dataSource.getRepository(Permission);
    // 定义权限列表
    const permissions: Pick<Permission, 'code' | 'name' | 'desc'>[] = [
      {
        code: permissionEnums.USER_VIEW,
        name: '查看用户',
        desc: '允许查看用户信息',
      },
      {
        code: permissionEnums.USER_EDIT,
        name: '编辑用户',
        desc: '允许编辑用户信息',
      },
      {
        code: permissionEnums.USER_DELETE,
        name: '删除用户',
        desc: '允许删除用户信息',
      },
      {
        code: permissionEnums.ROLE_VIEW,
        name: '查看角色',
        desc: '允许查看角色信息',
      },
      {
        code: permissionEnums.ROLE_EDIT,
        name: '编辑角色',
        desc: '允许编辑角色信息',
      },
      {
        code: permissionEnums.ROLE_DELETE,
        name: '删除角色',
        desc: '允许删除角色信息',
      },
      {
        code: permissionEnums.DATA_EXPORT,
        name: '导出数据',
        desc: '允许导出系统数据',
      },
      {
        code: permissionEnums.LOG_VIEW,
        name: '查看日志',
        desc: '允许查看系统日志',
      },
    ];

    for (const permission of permissions) {
      const existingPermission = await permissionRepository.findOne({
        where: { code: permission.code },
      });
      if (!existingPermission) {
        const p = Object.assign(permission, {
          creator_id: '-1',
          operator_id: '-1',
        });
        const newPermission = permissionRepository.create(p);
        await permissionRepository.save(newPermission);
        console.log(`🎉🎉 Permission ${permission.name} created.`);
      }
    }

    // ---------------------------------------------------

    this.track = true;
  }
}
