import { IResolvers } from 'graphql-tools';

// Define resolvers
export const Resolvers: IResolvers = {
  Query: {
    hello: (): string => {
      return `👋 Hello world! 👋`;
    },
  },
};
