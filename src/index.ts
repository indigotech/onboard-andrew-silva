import 'reflect-metadata';
import { Connection } from './data/config/connection';
import { Server } from './server';
import dotenv from 'dotenv';

// Config environments
dotenv.config();

// Database connection
Connection().then(() => {
  console.log(`🟢 Database connected`);
  Server().then(() => {
    console.log(
      `🟢 GraphQL is running on http://localhost:${process.env.PORT}${process.env.GRAPHQL_PLAYGROUND_ENDPOINT}`,
    );
  });
});
