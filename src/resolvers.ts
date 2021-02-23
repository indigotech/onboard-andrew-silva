import { IResolvers } from 'graphql-tools';

// Define resolvers
const resolvers: IResolvers = {
  Query: {
    hello: (_: void, args: void): string => {
        return `👋 Hello world! 👋`;
    },
  },
};

export { resolvers };