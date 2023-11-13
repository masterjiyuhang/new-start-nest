import bcrypt from 'bcrypt';

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

/**
 * 加密
 * @param myPlaintextPassword
 * @returns
 */
export const hashPassword = (myPlaintextPassword: string) =>
  bcrypt.hashSync(myPlaintextPassword, salt);

/**
 * 比较密码
 * @param password
 * @param userInputPass
 */
export const compare = (password: string, userInputPass: string) => {
  bcrypt.compare(password, userInputPass);
};
