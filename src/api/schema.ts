import 'graphql-import-node';
import { GraphQLSchema } from 'graphql';
import { buildSchemaSync } from 'type-graphql';
import { HelloResolver } from './modules/hello/hello.resolver';
import { UserResolver } from './modules/user/user.resolver';
import { LoginResolver } from './modules/login/login.resolver';

// Load resolvers
export const Schema: GraphQLSchema = buildSchemaSync({
  resolvers: [HelloResolver, UserResolver, LoginResolver],
});
