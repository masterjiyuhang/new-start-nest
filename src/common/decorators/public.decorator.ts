import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
/**
 * 凌驾一切之上的装饰器函数 无视auth 和 role 权限控制
 * @returns {Boolean} true
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
