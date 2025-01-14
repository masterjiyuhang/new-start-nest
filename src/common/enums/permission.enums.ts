// export enum permissionsEnums {
//   CREATE = 1,
//   READ = 2,
//   UPDATE = 3,
//   DELETE = 4,
// }

export enum permissionEnums {
  // 用户管理
  USER_VIEW = 'user:view',
  USER_EDIT = 'user:edit',
  USER_DELETE = 'user:delete',

  // 角色管理
  ROLE_VIEW = 'role:view',
  ROLE_EDIT = 'role:edit',
  ROLE_DELETE = 'role:delete',

  // 数据管理
  DATA_EXPORT = 'data:export',

  // 日志管理
  LOG_VIEW = 'log:view',
}
