import { Resolver, Mutation, Arg } from 'type-graphql';
import { LoginInput } from './login.input';
import { LoginType } from './login.type';
import { UserEntity } from '@data/entity/user.entity';

import bcrypt from 'bcrypt';

@Resolver()
export class LoginResolver {
  @Mutation(() => LoginType)
  async login(@Arg('data') data: LoginInput) {
    const user: UserEntity | undefined = await UserEntity.findOne({ email: data.email });
    if (user && (await bcrypt.compare(data.password, user.password))) {
      return { user, token: 'the_token' };
    }
    throw new Error('Email ou senha incorretos');
  }
}
