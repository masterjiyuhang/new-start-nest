import { registerAs } from '@nestjs/config';

export const jwtConstants = {
  secret:
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};
export const baseConfig = registerAs('baseConfig', () => ({
  port: process.env.PORT || 3001,
}));

export const defaultConfig = () => ({
  ...jwtConstants,

  jwtSecret: '1Q2e3W4!4%!!@*^sq123',
  jwtRefreshSecret: 'qwe@s#F43K*&sqw4@^2^21',
});
