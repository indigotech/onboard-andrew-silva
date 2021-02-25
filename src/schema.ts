import 'graphql-import-node';
import { GraphQLSchema } from 'graphql';
import { buildSchemaSync } from 'type-graphql';
import { HelloResolver } from './resolver/hello-resolver';

// Load resolvers
export const Schema: GraphQLSchema = buildSchemaSync({
  resolvers: [HelloResolver],
});
