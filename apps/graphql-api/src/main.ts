/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import * as mongoose from 'mongoose';
import { environment } from './environments/environment';

import {typeDefs, resolvers }from './app/graphql/index';
async function main(){
  const app = express();
  const PORT = process.env.PORT || 4000;
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:({req})=>{
      req.headers.authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjAyMjdkNTk0YjNlMjFlY2U0NGY0ZGYiLCJlbWFpbCI6ImJyb2NrQG9ubGluZW1haWwuY29tIiwiaWF0IjoxNjQ0MzEzMDE0LCJleHAiOjE2NDQzOTk0MTR9.YK9g-Et4Men93vsKQ0wkjVcgvMoQcFDK5mPniRvyXmo'
      return {req}
    }
  });



  await server.start();

  server.applyMiddleware({ app });

  mongoose.connect(environment.DATABASE_CONNECT_CLOUD,{
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    autoIndex: true,
    dbName: 'eshop-database'
})
.then(()=>{
    console.log('DB connection ready');
    app.listen(PORT, ()=>{
      console.log(`Server running on port ${PORT}`)
    })
})
.catch((err)=>{
    console.log(err);
});


}




main();
