import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { UserEntity } from '@data/entity/user.entity';
import { UserInput } from './user.input';
import { UserType } from './user.type';

@Resolver()
export class UserResolver {
  @Query(() => String)
  async users() {
    return 'Users';
  }

  @Mutation(() => UserType)
  async createUser(@Arg('data') data: UserInput) {
    const user = UserEntity.create(data);
    return user;
  }
}
