import bcrypt from 'bcrypt';
import { createRequest } from '@test/create-request';
import { expect } from 'chai';

import { UserInput } from '@api/schema/user/user.input';
import { UserEntity } from '@data/entity/user.entity';
import { Authenticator } from '@api/server/authenticator';

const createUserMutation = `
mutation createUser($data: UserInput!) {
  createUser(data: $data) {
    id
    name
    email
    birthDate
  }
}`;

describe('GraphQL: User - mutation createUser', () => {
  it('should successfully create user', async () => {
    const input: UserInput = {
      name: 'Padmé Amidala',
      email: 'padmeia@yahoo.com',
      password: 'padead123',
      birthDate: new Date(),
    };

    const token = await Authenticator.getTestToken();
    const res = await createRequest(createUserMutation, { data: input }, token);

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

    const res = await createRequest(createUserMutation, { data: input });

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

    const res = await createRequest(
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

    const res = await createRequest(
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

    const token = await Authenticator.getTestToken();
    const res = await createRequest(createUserMutation, { data: input }, token);

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

    const token = await Authenticator.getTestToken();
    const res = await createRequest(createUserMutation, { data: input }, token);

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

    const token = await Authenticator.getTestToken();
    const res = await createRequest(createUserMutation, { data: input }, token);

    expect(res.body.data).to.be.null;

    const errorMessages = res.body.errors.map((error: { message: string }) => error.message);
    expect(errorMessages).to.include('Argumentos inválidos');
    const errorIndex = errorMessages.indexOf('Argumentos inválidos');

    expect(res.body.errors[errorIndex]).to.own.property('details');
    expect(res.body.errors[errorIndex].details).to.include('A senha precisa ter pelo menos 7 caracteres');
    expect(res.body.errors[errorIndex].details).to.include('A senha precisa ter pelo uma letra e um número');
  });
});
