import 'graphql-import-node';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import * as typeDefs from './schema/schema.graphql';
import { Resolvers } from './resolvers';

// Load resolvers
export const Schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers: Resolvers,
});
