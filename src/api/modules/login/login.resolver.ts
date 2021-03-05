import { Resolver, Mutation, Arg } from 'type-graphql';
import { BaseError } from '@api/error/base-error';
import { LoginInput } from './login.input';
import { LoginType } from './login.type';
import { UserEntity } from '@data/entity/user.entity';

import bcrypt from 'bcrypt';

@Resolver()
export class LoginResolver {
  @Mutation(() => LoginType)
  async login(@Arg('data') data: LoginInput) {
    const user: UserEntity | undefined = await UserEntity.findOne({ email: data.email });
    if (user) {
      if (await bcrypt.compare(data.password, user.password)) {
        return { user, token: 'the_token' };
      } else {
        throw new BaseError(401, 'Email ou senha incorretos');
      }
    } else {
      throw new BaseError(404, 'Email não cadastrado');
    }
  }
}
