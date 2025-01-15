import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const ROLE_DECORATOR_KEY = 'roles';

/**
 * 角色权限控制
 * @param roles 角色code
 * @returns CustomDecorator
 */
export const Roles = (...roles: number[]): CustomDecorator =>
  SetMetadata(
    ROLE_DECORATOR_KEY,
    roles.map((item) => item + ''),
  );
