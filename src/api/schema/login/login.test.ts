import { Request } from '@test/request';
import { expect } from 'chai';

import { UserEntity } from '@data/entity/user.entity';
import { LoginInput } from '@api/schema/login/login.input';
import { Authenticator } from '@api/server/authenticator';

const loginMutation = `
mutation login($data: LoginInput!) {
  login(data: $data) {
    user {
      id
      name
      email
      birthDate
    }
    token
  }
}`;

const getTestUser = async () => {
  const user = UserEntity.create({
    name: 'Luke Skywalker',
    email: 'skylwalker.top@gmail.com',
    password: 'a1ÊÇ7ma2',
    birthDate: new Date(),
  });
  await user.save();
  return user;
};

describe('GraphQL: Login - mutation login', () => {
  it('should login successfully', async () => {
    const user = await getTestUser();

    const input: LoginInput = {
      email: user.email,
      password: 'a1ÊÇ7ma2',
      rememberMe: false,
    };

    const res = await Request(loginMutation, { data: input });

    expect(res.body).to.not.own.property('errors');
    expect(res.body.data.login.token).to.be.an('string');

    const payload = Authenticator.getPayload(res.body.data.login.token);
    expect(payload.id).to.be.eq(user.id);
    expect(Number(payload.exp) - Number(payload.iat)).to.be.eq(3600);

    expect(res.body.data.login.user).to.be.deep.eq({
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate.toISOString(),
    });
  });

  it('should login successfully with extended expiration time', async () => {
    const user = await getTestUser();

    const input: LoginInput = {
      email: user.email,
      password: 'a1ÊÇ7ma2',
      rememberMe: true,
    };

    const res = await Request(loginMutation, { data: input });

    expect(res.body).to.not.own.property('errors');
    expect(res.body.data.login.token).to.be.an('string');

    const payload = Authenticator.getPayload(res.body.data.login.token);
    expect(payload.id).to.be.eq(user.id);
    expect(Number(payload.exp) - Number(payload.iat)).to.be.eq(3600 * 24 * 7);

    expect(res.body.data.login.user).to.be.deep.eq({
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate.toISOString(),
    });
  });

  it('should trigger unknown user error', async () => {
    const input: LoginInput = {
      email: 'skylwalker.top@gmail.com',
      password: 'a1ÊÇ7ma2',
      rememberMe: false,
    };

    const res = await Request(loginMutation, { data: input });

    expect(res.body.data).to.be.null;
    expect(res.body).to.own.property('errors');
    expect(res.body.errors).to.deep.include({ code: 404, message: 'Email não cadastrado' });
  });

  it('should trigger invalid password error', async () => {
    const user = await getTestUser();

    const input: LoginInput = {
      email: user.email,
      password: 'a1ÊÇ7ma',
      rememberMe: false,
    };

    const res = await Request(loginMutation, { data: input });

    expect(res.body.data).to.be.null;
    expect(res.body).to.own.property('errors');
    expect(res.body.errors).to.deep.include({ code: 401, message: 'Email ou senha incorretos' });
  });
});
