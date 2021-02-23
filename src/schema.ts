import 'graphql-import-node';
import * as typeDefs from './schema/schema.graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';
import { GraphQLSchema } from 'graphql';

// Load resolvers
const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export { schema };
