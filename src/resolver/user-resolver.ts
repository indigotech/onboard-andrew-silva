import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { User } from '../entity/user';
import { CreateUserInput } from '../input/create-user-input';

@Resolver()
export class UserResolver {
  @Query(() => String)
  users() {
    return 'Users';
  }

  @Mutation(() => User)
  async createUser(@Arg('data') data: CreateUserInput) {
    const user = User.create(data);
    return user;
  }
}
