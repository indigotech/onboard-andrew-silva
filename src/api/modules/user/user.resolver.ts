import { UserInputError } from 'apollo-server-express';
import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { UserEntity } from '@data/entity/user.entity';
import { UserInput } from './user.input';
import { UserType } from './user.type';

@Resolver()
export class UserResolver {
  @Query(() => [UserType])
  async users() {
    return UserEntity.find();
  }

  @Mutation(() => UserType)
  async createUser(@Arg('data') data: UserInput) {
    const user = UserEntity.create(data);
    try {
      await user.save()
    }
    catch(err) {
      throw new UserInputError(err.detail);
    }
    return user;
  }
}
