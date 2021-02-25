import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import compression from 'compression';
import cors from 'cors';
import { Schema } from './schema';

// Create Apollo Server
const App = express();
const server = new ApolloServer({
  schema: Schema,
  validationRules: [depthLimit(7)],
});

// Define some policies
App.use('*', cors());
App.use(compression());

// Use Graphql Playground
server.applyMiddleware({
  app: App,
  path: '/graphql',
});

export { App };
