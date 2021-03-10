import { Resolver, Query, Mutation, Arg, Authorized, Int } from 'type-graphql';
import { BaseError } from '@api/error/base-error';
import { UserEntity } from '@data/entity/user.entity';
import { PageInput } from '@api/schema/pagination/page.input';
import { UserInput } from './user.input';
import { UserType } from './user.type';
import { UsersType } from './users.type';

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

  @Query(() => UsersType)
  async users(@Arg('page', () => PageInput) page: PageInput) {
    if (!page.offset) {
      page.offset = 0;
    }

    const count = await UserEntity.count();
    const users = await UserEntity.find({
      order: { name: 'ASC' },
      skip: page.offset,
      take: page.limit,
    });

    return {
      users,
      count,
      limit: page.limit,
      offset: page.offset,
      hasNextPage: page.offset + users.length < count,
      hasPreviousPage: page.offset > 0 && count > 0,
    };
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
