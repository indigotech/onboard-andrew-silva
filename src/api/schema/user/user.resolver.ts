import { Resolver, Query, Mutation, Arg, Authorized, Int } from 'type-graphql';
import { UserEntity } from '@data/entity/user.entity';
import { UserInput } from './user.input';
import { UserType } from './user.type';
import { BaseError } from '@api/error/base-error';

@Resolver()
export class UserResolver {
  @Query(() => UserType)
  @Authorized()
  async user(@Arg('id', () => String) id: string) {
    const user: UserEntity | undefined = await UserEntity.findOne(id);

    if (user) {
      return user;
    }

    throw new BaseError(404, 'Usuário inexistente');
  }

  @Query(() => [UserType])
  async users(@Arg('limit', () => Int, { defaultValue: 10 }) limit: number = 10) {
    if (limit < 0) {
      throw new BaseError(400, 'O limite não pode ser negativo');
    }

    const users = await UserEntity.find({
      order: { name: 'ASC' },
      take: limit,
    });
    return users;
  }

  @Mutation(() => UserType)
  @Authorized()
  async createUser(@Arg('data', () => UserInput) data: UserInput) {
    try {
      const user = UserEntity.create(data);
      await user.save();

      return user;
    } catch (error) {
      if (error.code == '23505') {
        throw new BaseError(400, 'Email já cadastrado');
      } else {
        throw new BaseError(500, 'Erro ao realizar ação');
      }
    }
  }
}
