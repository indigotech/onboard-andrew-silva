import { LocalDB } from './connection/local-db';
import { createServer } from 'http';
import { App } from './app';

// Database connection
LocalDB.then(()=>console.log('🛰  Database connected'))

// Server listening
const httpServer = createServer(App);
httpServer.listen({ port: 3000 }, () => console.log(`\n🚀 GraphQL is running on http://localhost:3000/graphql`));