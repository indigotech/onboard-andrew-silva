import { Resolver, Mutation, Arg } from 'type-graphql';
import { LoginType } from './login.type';
import bcrypt from 'bcrypt';

@Resolver()
export class LoginResolver {
  @Mutation(() => LoginType)
  async login() {
    return {
      user: {
        id: 12,
        name: 'User Name',
        email: 'User e-mail',
        birthDate: new Date(),
      },
      token: 'the_token',
    };
  }
}
