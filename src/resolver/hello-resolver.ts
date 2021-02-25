import { IResolvers } from 'graphql-tools';

// Define resolvers
export const HelloResolver: IResolvers = {
  Query: {
    hello: (): string => {
      return `👋 Hello world! 👋`;
    },
  },
};
