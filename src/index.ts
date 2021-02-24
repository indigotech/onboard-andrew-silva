import { createServer } from 'http';
import { App } from './app';

const httpServer = createServer(App);
httpServer.listen({ port: 3000 }, () => console.log(`\n🚀 GraphQL is running on http://localhost:3000/graphql\n`));