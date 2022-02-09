import {environment as globalEnv }from '@env/env'
export const environment = {
  ...globalEnv,
  production: false,

  // DATABASE_CONNECT_CLOUD : `mongodb+srv://Admin:Blue0316@cluster0.21hd7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  // HashSecret: 'superBalloons'
};
