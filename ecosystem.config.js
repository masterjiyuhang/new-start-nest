module.exports = {
  apps: [
    {
      name: 'nest-server-app',
      script: 'dist/main.js',
      env_prod: {
        NODE_ENV: 'prod',
        PORT: 3234,
        DATABASE_HOST: '127.0.0.1',
        DATABASE_PORT: 3306,
        DATABASE_USER: 'root',
        DATABASE_PASSWORD: 'cd13f6e448fb9d31',
        DATABASE_NAME: 'management_test',
      },
    },
  ],
};
