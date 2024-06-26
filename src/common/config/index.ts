import { registerAs } from '@nestjs/config';
import { db } from './db';

export const jwtConstants = {
  secret:
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};
export const baseConfig = registerAs('baseConfig', () => ({
  port: process.env.PORT || 3000,
  db: {
    ...db,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },
}));

export const defaultConfig = () => ({
  ...jwtConstants,
  jwtSecret: '1Q2e3W4!4%!!@*^sq123',
  jwtRefreshSecret: 'qwe@s#F43K*&sqw4@^2^21',
});
