import { IResolvers } from 'graphql-tools';

// Define resolvers
const Resolvers: IResolvers = {
  Query: {
    hello: (): string => {
      return `👋 Hello world! 👋`;
    },
  },
};

export { Resolvers };
