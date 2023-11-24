export enum ApiErrorCode {
  SUCCESS = 200, // 成功
  USER_ID_INVALID = 10001, // 用户id无效
  USER_NOT_EXIST = 10002, // 用户不存在
  USER_EXIST = 10003, //用户已存在
  PERMISSION_EXIST = 10004, //权限已存在
  ROLE_EXIST = 10005, //角色已存在
  PASSWORD_ERROR = 20005, //密码错误
  FORBIDDEN = 400, //验证不通过
  LOGIN_EXPIRE = 401, //登录状态已过期
  Forbidden = 403, //权限不足
  DATABASE_ERROR = 30001, //数据库错误

  CAR_TYPE_EXIST = 10006, // 车辆类型已存在
  CAR_EXIST = 10007, // 车辆类型已存在
}
