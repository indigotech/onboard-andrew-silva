import bcrypt from 'bcrypt';
import { Request } from '@test/request';
import { expect } from 'chai';

import { UserInput } from '@api/schema/user/user.input';
import { UserEntity } from '@data/entity/user.entity';
import { Authenticator } from '@api/server/authenticator';
import { UserType } from './user.type';

const userQuery = `
query user ($id: String!) {
  user(id : $id) {
    id
    name
    email
    birthDate
  }
}`;

const createUserMutation = `
mutation createUser($data: UserInput!) {
  createUser(data: $data) {
    id
    name
    email
    birthDate
  }
}`;

const getTestToken = async (): Promise<string> => {
  const user = UserEntity.create({
    name: 'Luke Skywalker',
    email: 'skylwalker.top@gmail.com',
    password: 'a1ÊÇ7ma2',
    birthDate: new Date(),
  });
  await user.save();

  return Authenticator.getJWT({ id: user.id });
};

describe('GraphQL: User - query user', () => {
  it('should return a user successfully', async () => {
    const user = UserEntity.create({
      name: 'Padmé Amidala',
      email: 'padmeia@yahoo.com',
      password: 'padead123',
      birthDate: new Date(),
    });
    await user.save();

    const token = await getTestToken();
    const res = await Request(userQuery, { id: user.id }, token);

    expect(res.body).to.not.own.property('errors');
    expect(res.body.data.user).to.include({
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate.toISOString(),
    });
  });

  it('should trigger unknown user error', async () => {
    const token = await getTestToken();
    const res = await Request(userQuery, { id: '00000000-0000-0000-0000-000000000000' }, token);

    expect(res.body.data).to.be.null;
    expect(res.body.errors).to.deep.include({
      code: 404,
      message: 'Usuário inexistente',
    });
  });

  it('should trigger invalid id error', async () => {
    const user = UserEntity.create({
      name: 'Padmé Amidala',
      email: 'padmeia@yahoo.com',
      password: 'padead123',
      birthDate: new Date(),
    });
    await user.save();

    const token = await getTestToken();
    const res = await Request(userQuery, { id: 'wrong id' }, token);

    expect(res.body.data).to.be.null;
    expect(res.body.errors).to.deep.include({
      code: 400,
      message: 'Identificador de usuário inválido',
    });
  });

  it('should trigger token not sent error', async () => {
    const user = UserEntity.create({
      name: 'Padmé Amidala',
      email: 'padmeia@yahoo.com',
      password: 'padead123',
      birthDate: new Date(),
    });
    await user.save();

    const res = await Request(userQuery, { id: user.id });

    expect(res.body.data).to.be.null;
    expect(res.body.errors).to.deep.include({
      code: 401,
      message: 'Usuário não autorizado',
      details: 'Token não enviado',
    });
  });

  it('should trigger expired token error', async () => {
    const user = UserEntity.create({
      name: 'Padmé Amidala',
      email: 'padmeia@yahoo.com',
      password: 'padead123',
      birthDate: new Date(),
    });
    await user.save();

    const res = await Request(
      userQuery,
      { id: user.id },
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ2ODI4MmU4LThlNTEtNGNiZi04MzBlLTg1NGZhNzFkOWJhYiIsImlhdCI6MTYxNTIyMjk4NCwiZXhwIjoxNjE1MjIyOTg2fQ._6-JMIVvkJVVhr8ic3qzTDHSpAAvibL54xWLVW1u-TU',
    );

    expect(res.body.data).to.be.null;
    expect(res.body.errors).to.deep.include({
      code: 401,
      message: 'Usuário não autorizado',
      details: 'Token expirado',
    });
  });

  it('should trigger invalid token error', async () => {
    const user = UserEntity.create({
      name: 'Padmé Amidala',
      email: 'padmeia@yahoo.com',
      password: 'padead123',
      birthDate: new Date(),
    });
    await user.save();

    const res = await Request(
      userQuery,
      { id: user.id },
      'eyJpZCI6ImQ2ODI4MmU4LThlNTEtNGNiZi04MzBlLTg1NGZhNzFkOWJhYiIsImlhdCI6MTYxNTIyMjk4NCwiZXhwIjoxNjE1MjIyOTg2fQ._6-JMIVvkJVVhr8ic3qzTDHSpAAvibL54xWLVW1u-TU',
    );

    expect(res.body.data).to.be.null;
    expect(res.body.errors).to.deep.include({
      code: 401,
      message: 'Usuário não autorizado',
      details: 'Token inválido',
    });
  });
});

describe('GraphQL: User - mutation createUser', () => {
  it('should create user successfully', async () => {
    const input: UserInput = {
      name: 'Padmé Amidala',
      email: 'padmeia@yahoo.com',
      password: 'padead123',
      birthDate: new Date(),
    };

    const token = await getTestToken();
    const res = await Request(createUserMutation, { data: input }, token);

    expect(res.body).to.not.own.property('errors');
    expect(res.body.data.createUser).to.have.property('id');
    expect(res.body.data.createUser).to.include({
      name: input.name,
      email: input.email,
      birthDate: input.birthDate.toISOString(),
    });

    const user = await UserEntity.findOneOrFail(res.body.data.createUser.id);
    expect(user).to.not.be.undefined;
    expect(await bcrypt.compare(input.password, user.password)).to.be.true;
    expect(user).to.deep.include({
      id: res.body.data.createUser.id,
      name: input.name,
      email: input.email,
      birthDate: input.birthDate,
    });
  });

  it('should trigger token not sent error', async () => {
    const input: UserInput = {
      name: 'Padmé Amidala',
      email: 'wrong email',
      password: 'padead123',
      birthDate: new Date(),
    };

    const res = await Request(createUserMutation, { data: input });

    expect(res.body.data).to.be.null;
    expect(res.body.errors).to.deep.include({
      code: 401,
      message: 'Usuário não autorizado',
      details: 'Token não enviado',
    });
  });

  it('should trigger expired token error', async () => {
    const input: UserInput = {
      name: 'Padmé Amidala',
      email: 'wrong email',
      password: 'padead123',
      birthDate: new Date(),
    };

    const res = await Request(
      createUserMutation,
      { data: input },
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ2ODI4MmU4LThlNTEtNGNiZi04MzBlLTg1NGZhNzFkOWJhYiIsImlhdCI6MTYxNTIyMjk4NCwiZXhwIjoxNjE1MjIyOTg2fQ._6-JMIVvkJVVhr8ic3qzTDHSpAAvibL54xWLVW1u-TU',
    );

    expect(res.body.data).to.be.null;
    expect(res.body.errors).to.deep.include({
      code: 401,
      message: 'Usuário não autorizado',
      details: 'Token expirado',
    });
  });

  it('should trigger invalid token error', async () => {
    const input: UserInput = {
      name: 'Padmé Amidala',
      email: 'wrong email',
      password: 'padead123',
      birthDate: new Date(),
    };

    const res = await Request(
      createUserMutation,
      { data: input },
      'eyJpZCI6ImQ2ODI4MmU4LThlNTEtNGNiZi04MzBlLTg1NGZhNzFkOWJhYiIsImlhdCI6MTYxNTIyMjk4NCwiZXhwIjoxNjE1MjIyOTg2fQ._6-JMIVvkJVVhr8ic3qzTDHSpAAvibL54xWLVW1u-TU',
    );

    expect(res.body.data).to.be.null;
    expect(res.body.errors).to.deep.include({
      code: 401,
      message: 'Usuário não autorizado',
      details: 'Token inválido',
    });
  });

  it('should trigger duplicate email error', async () => {
    const input: UserInput = {
      name: 'Luke Skywalker',
      email: 'skylwalker.top@gmail.com',
      password: 'a1ÊÇ7ma2',
      birthDate: new Date(),
    };

    const token = await getTestToken();
    const res = await Request(createUserMutation, { data: input }, token);

    expect(res.body.data).to.be.null;
    expect(res.body.errors).to.deep.include({ code: 400, message: 'Email já cadastrado' });
  });

  it('should trigger email validation error', async () => {
    const input: UserInput = {
      name: 'Padmé Amidala',
      email: 'wrong email',
      password: 'padead123',
      birthDate: new Date(),
    };

    const token = await getTestToken();
    const res = await Request(createUserMutation, { data: input }, token);

    expect(res.body.data).to.be.null;

    const errorMessages = res.body.errors.map((error: { message: string }) => error.message);
    expect(errorMessages).to.include('Argumentos inválidos');
    const errorIndex = errorMessages.indexOf('Argumentos inválidos');

    expect(res.body.errors[errorIndex]).to.own.property('details');
    expect(res.body.errors[errorIndex].details).to.include('O email precisa ser um endereço de e-mail válido');
  });

  it('should trigger password validation error', async () => {
    const input: UserInput = {
      name: 'Padmé Amidala',
      email: 'padmeia@yahoo.com',
      password: 'aaa',
      birthDate: new Date(),
    };

    const token = await getTestToken();
    const res = await Request(createUserMutation, { data: input }, token);

    expect(res.body.data).to.be.null;

    const errorMessages = res.body.errors.map((error: { message: string }) => error.message);
    expect(errorMessages).to.include('Argumentos inválidos');
    const errorIndex = errorMessages.indexOf('Argumentos inválidos');

    expect(res.body.errors[errorIndex]).to.own.property('details');
    expect(res.body.errors[errorIndex].details).to.include('A senha precisa ter pelo menos 7 caracteres');
    expect(res.body.errors[errorIndex].details).to.include('A senha precisa ter pelo uma letra e um número');
  });
});
