import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNotBlacklistedDomain', async: false })
export class IsNotBlacklistedDomain implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(email: string, _args: ValidationArguments) {
    const blacklistedDomains: Record<string, string> = {
      'qq.com': 'QQ email addresses are not allowed.',
      'example.com': 'Example domain is not allowed.',
      // 可以根据需要添加更多的域名和对应的错误消息
    };

    const [, domain] = email.split('@');

    return !(domain in blacklistedDomains);
  }

  defaultMessage(args: ValidationArguments) {
    return `Email address is not allowed: ${args.value}`;
  }
}

/**
 * 自定义校验规则
 * @returns {PropertyDecorator} 校验邮箱是否通过默认验证
 */
export function IsNotBlacklistedDomainConstraint(): PropertyDecorator {
  return Validate(IsNotBlacklistedDomain);
}
