/* eslint-disable @typescript-eslint/no-unused-vars */
import 'reflect-metadata';
import * as express from 'express';
import session from 'express-session';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import { typeDefs, resolvers } from './app/graphql';
import * as mongoose from 'mongoose';
import { environment } from './environments/environment';

async function main() {
  const app = express();
  const PORT = process.env.PORT || 4000;

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }: ExpressContext) => {
      req.headers.authorization =
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjAyMjdkNTk0YjNlMjFlY2U0NGY0ZGYiLCJlbWFpbCI6ImJyb2NrQG9ubGluZW1haWwuY29tIiwiaWF0IjoxNjQ0MzEzMDE0LCJleHAiOjE2NDQzOTk0MTR9.YK9g-Et4Men93vsKQ0wkjVcgvMoQcFDK5mPniRvyXmo';
      return { req };
    },
  });
  await server.start().then(() => console.log('Apollo Server Running'));

  server.applyMiddleware({ app });

  mongoose
    .connect(environment.DATABASE_CONNECT_CLOUD, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      autoIndex: true,
      dbName: 'eshop-database',
    })
    .then(() => {
      console.log('DB connection ready');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.log('DB connection Failed');
      console.log(err);
    });
}

main();
