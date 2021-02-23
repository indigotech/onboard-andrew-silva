import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import { createServer } from 'http';
import compression from 'compression';
import cors from 'cors';
import schema from './schema';

// Create Apollo Server
const app = express();
const server = new ApolloServer({
  schema,
  validationRules: [depthLimit(7)],
});

// Define some policies
app.use('*', cors());
app.use(compression());

// Use Graphql Playground
server.applyMiddleware({ app, path: '/graphql' });

// Run server
const httpServer = createServer(app);
httpServer.listen({ port: 3000 }, (): void => console.log(`\n🚀 GraphQL is running on http://localhost:3000/graphql\n`));