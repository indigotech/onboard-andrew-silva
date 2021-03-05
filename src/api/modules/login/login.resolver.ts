import { Resolver, Mutation, Arg } from 'type-graphql';
import { BaseError } from '@api/error/base-error';
import { LoginInput } from './login.input';
import { LoginType } from './login.type';
import { UserEntity } from '@data/entity/user.entity';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

@Resolver()
export class LoginResolver {
  @Mutation(() => LoginType)
  async login(@Arg('data') data: LoginInput) {
    const user: UserEntity | undefined = await UserEntity.findOne({ email: data.email });
<<<<<<< HEAD
    if (!user) {
=======
    if (user) {
      if (await bcrypt.compare(data.password, user.password)) {
        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, String(process.env.JWT_SECRET), {
          expiresIn: Number(process.env.JWT_EXPIRATION_TIME),
        });
        return { user, token };
      } else {
        throw new BaseError(401, 'Email ou senha incorretos');
      }
    } else {
>>>>>>> feat: using enviroment variables to define jwt secret and expiration time
      throw new BaseError(404, 'Email não cadastrado');
    }

    if (await bcrypt.compare(data.password, user.password)) {
      const token = jwt.sign({ id: user.id }, String(process.env.JWT_SECRET), {
        expiresIn: Number(process.env.JWT_EXPIRATION_TIME),
      });
      return { user, token };
    }

    throw new BaseError(401, 'Email ou senha incorretos');
  }
}
