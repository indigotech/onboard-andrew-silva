import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import compression from 'compression';
import cors from 'cors';
import { Schema } from '@api/schema';
import { createServer, Server as HttpServer } from 'http';
import dotenv from 'dotenv';
import { ArgumentValidationError } from 'type-graphql';

// Config environments
dotenv.config({ path: process.env.TEST == 'true' ? '.test.env' : '.env' });

export const Server = async (): Promise<HttpServer> => {
  // Create Apollo Server
  const App = express();
  const server = new ApolloServer({
    schema: Schema,
    validationRules: [depthLimit(7)],
    formatError: (err) => {
      const originalError = err.originalError;
      let code: number = 400;
      let message: string;
      let detail;

      if (originalError instanceof ArgumentValidationError) {
        const errors = originalError.validationErrors.map((validationError) => {
          if (validationError.constraints) {
            const messages = [];
            for (let key in validationError.constraints) {
              messages.push(validationError.constraints[key]);
            }
            return messages;
          }
        });
        message = 'Argumentos inválidos';
        detail = errors;
      } else {
        message = err.message;
        detail = err?.extensions?.exception.detail;
      }

      return {
        code: code,
        message: message,
        detail: detail,
      };
    },
  });

  // Define some policies
  App.use('*', cors());
  App.use(compression());

  // Use Graphql Playground
  server.applyMiddleware({
    app: App,
    path: process.env.GRAPHQL_PLAYGROUND_ENDPOINT,
  });

  // Start server
  const httpServer = createServer(App);
  return httpServer.listen({ port: process.env.PORT });
};
