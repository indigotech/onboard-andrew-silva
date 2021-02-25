import { Resolver, Query } from "type-graphql";

@Resolver()
export class UserResolver {
  @Query(() => String)
  users() {
    return 'Users';
  }
}