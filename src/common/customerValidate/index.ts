import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNotBlacklistedDomain', async: false })
export class IsNotBlacklistedDomain implements ValidatorConstraintInterface {
  // 在类外部定义 blacklistedDomains，以便在 defaultMessage 方法中访问
  private static blacklistedDomains: Record<string, string> = {
    'qq.com': '不允许使用 QQ 邮箱地址。',
    'example.com': '不允许使用示例域名。',
    // 根据需要添加更多的域名和对应的错误消息
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(email: string, _args: ValidationArguments) {
    const [, domain] = email.split('@');

    if (domain in IsNotBlacklistedDomain.blacklistedDomains) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const email = args.value as string;
    const [, domain] = email.split('@');

    // 检查黑名单中是否有特定的错误消息
    if (domain in IsNotBlacklistedDomain.blacklistedDomains) {
      return IsNotBlacklistedDomain.blacklistedDomains[domain];
    }

    // 如果域名不在黑名单中，则返回默认错误消息
    return `不允许使用该邮箱地址: ${email}`;
  }
}

/**
 * 自定义校验规则
 * @returns {PropertyDecorator} 校验邮箱是否通过默认验证
 */
export function IsNotBlacklistedDomainConstraint(): PropertyDecorator {
  return Validate(IsNotBlacklistedDomain);
}
