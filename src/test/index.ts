import request from 'supertest';
import bcrypt from 'bcrypt';

import { expect } from 'chai';

import { Connection } from '@data/config/connection';
import { Server } from '@api/server/server';

import { UserInput } from '@api/schema/user/user.input';
import { UserEntity } from '@data/entity/user.entity';
import { LoginInput } from '@api/schema/login/login.input';

const createRequest = (query: string, variables?: object) => {
  return request
    .agent('http://localhost:3000')
    .post('/')
    .send({
      query,
      variables,
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200);
};

before(async () => {
  await Connection();
  await Server();
});

describe('GraphQL: Hello query', () => {
  it('should return successfully', async () => {
    const res = await createRequest('{ hello }');

    expect(res.body.data).to.be.deep.eq({ hello: '👋 Hello world! 👋' });
  });
});

describe('GraphQL: Login', () => {
  const mutation = `
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

  it('should login successfully', async () => {
    const user = UserEntity.create({
      name: 'Luke Skywalker',
      email: 'skylwalker.top@gmail.com',
      password: 'a1ÊÇ7ma2',
      birthDate: new Date(),
    });
    await user.save();

    const input: LoginInput = {
      email: user.email,
      password: 'a1ÊÇ7ma2',
      rememberMe: false,
    };

    const res = await createRequest(mutation, { data: input });

    expect(res.body).to.not.own.property('errors');
    expect(res.body.data.login.token).to.be.an('string');
    expect(res.body.data.login.user).to.include({
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

    const res = await createRequest(mutation, { data: input });

    expect(res.body.data).to.be.null;
    expect(res.body).to.own.property('errors');

    const errorMessages = res.body.errors.map((error: { message: string }) => error.message);
    expect(errorMessages).to.include('Email não cadastrado');
  });

  it('should trigger invalid password error', async () => {
    const user = UserEntity.create({
      name: 'Luke Skywalker',
      email: 'skylwalker.top@gmail.com',
      password: 'a1ÊÇ7ma2',
      birthDate: new Date(),
    });
    await user.save();

    const input: LoginInput = {
      email: user.email,
      password: 'a1ÊÇ7ma',
      rememberMe: false,
    };

    const res = await createRequest(mutation, { data: input });

    expect(res.body.data).to.be.null;
    expect(res.body).to.own.property('errors');

    const errorMessages = res.body.errors.map((error: { message: string }) => error.message);
    expect(errorMessages).to.include('Email ou senha incorretos');
  });
});

describe('GraphQL: User - createUser', () => {
  const mutation = `
    mutation createUser($data: UserInput!) {
      createUser(data: $data) {
        id
        name
        email
        birthDate
      }
    }`;

  it('should create user successfully', async () => {
    const userInput: UserInput = {
      name: 'Padmé Amidala',
      email: 'pão.de.mel@yahoo.com',
      password: 'paddead123',
      birthDate: new Date(),
    };

    const res = await createRequest(mutation, { data: userInput });

    expect(res.body).to.not.own.property('errors');
    expect(res.body.data.createUser).to.have.property('id');
    expect(res.body.data.createUser).to.include({
      name: userInput.name,
      email: userInput.email,
      birthDate: userInput.birthDate.toISOString(),
    });

    const user = (await UserEntity.findOne(res.body.data.createUser.id)) as UserEntity;
    expect(user).to.not.be.undefined;
    expect(await bcrypt.compare(userInput.password, user.password)).to.be.true;
    expect(user).to.deep.include({
      id: res.body.data.createUser.id,
      name: userInput.name,
      email: userInput.email,
      birthDate: userInput.birthDate,
    });
  });

  it('should trigger duplicate email error', async () => {
    const input: UserInput = {
      name: 'Anakin Skywalker',
      email: 'skylwalker.top@gmail.com',
      password: 'é8Ç7qwa2',
      birthDate: new Date(),
    };

    const res = await createRequest(mutation, { data: input });
    console.log(res.body);

    expect(res.body.data).to.be.null;
    expect(res.body).to.own.property('errors');

    const errorMessages = res.body.errors.map((error: { message: string }) => error.message);
    expect(errorMessages).to.include('Email já cadastrado');
  });

  it('should trigger email validation error', async () => {
    const input: UserInput = {
      name: 'Anakin Skywalker',
      email: 'wrong email',
      password: 'é8Ç7qwa2',
      birthDate: new Date(),
    };

    const res = await createRequest(mutation, { data: input });

    expect(res.body.data).to.be.null;
    expect(res.body).to.own.property('errors');

    const errorMessages = res.body.errors.map((error: { message: string }) => error.message);
    expect(errorMessages).to.include('Argumentos inválidos');
    const errorIndex = errorMessages.indexOf('Argumentos inválidos');

    expect(res.body.errors[errorIndex]).to.own.property('details');
    expect(res.body.errors[errorIndex].details).to.include('O email precisa ser um endereço de e-mail válido');
  });

  it('should trigger password validation error', async () => {
    const input: UserInput = {
      name: 'Anakin Skywalker',
      email: 'vader.darth@yahoo.com',
      password: 'aaaaaa',
      birthDate: new Date(),
    };

    const res = await createRequest(mutation, { data: input });

    expect(res.body.data).to.be.null;
    expect(res.body).to.own.property('errors');

    const errorMessages = res.body.errors.map((error: { message: string }) => error.message);
    expect(errorMessages).to.include('Argumentos inválidos');
    const errorIndex = errorMessages.indexOf('Argumentos inválidos');

    expect(res.body.errors[errorIndex]).to.own.property('details');
    expect(res.body.errors[errorIndex].details).to.include('A senha precisa ter pelo menos 7 caracteres');
    expect(res.body.errors[errorIndex].details).to.include('A senha precisa ter pelo uma letra e um número');
  });
});

afterEach(async () => {
  await UserEntity.clear();
});
