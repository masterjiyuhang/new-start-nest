import { hashSync, compare, genSaltSync } from 'bcrypt';

const saltRounds = 10;
const salt = genSaltSync(saltRounds);

/**
 * 加密
 * @param myPlaintextPassword
 * @returns
 */
export const hashPassword = (myPlaintextPassword: string) =>
  hashSync(myPlaintextPassword, salt);

/**
 * 比较密码
 * @param password
 * @param userInputPass
 */
export const comparePassword = (password: string, hashedPassword: string) => {
  return compare(password, hashedPassword);
};
