import bcrypt from 'bcrypt';
import { Request } from '@test/request';
import { expect } from 'chai';

import { UserInput } from '@api/schema/user/user.input';
import { UserEntity } from '@data/entity/user.entity';
import { LoginInput } from '@api/schema/login/login.input';

const createUserMutation = `
mutation createUser($data: UserInput!) {
  createUser(data: $data) {
    id
    name
    email
    birthDate
  }
}`;

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

describe('GraphQL: User - createUser', () => {
  it('should create user successfully', async () => {
    const authUser = UserEntity.create({
      name: 'Luke Skywalker',
      email: 'skylwalker.top@gmail.com',
      password: 'a1ÊÇ7ma2',
      birthDate: new Date(),
    });
    await authUser.save();

    const loginInput: LoginInput = {
      email: authUser.email,
      password: 'a1ÊÇ7ma2',
      rememberMe: false,
    };

    const loginRes = await Request(loginMutation, { data: loginInput });
    console.log(loginRes.body);

    const userInput: UserInput = {
      name: 'Padmé Amidala',
      email: 'padmeia@yahoo.com',
      password: 'padead123',
      birthDate: new Date(),
    };

    const res = await Request(createUserMutation, { data: userInput }, loginRes.body.data.login.token);
    console.log(res.body);

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

    const res = await Request(createUserMutation, { data: input });

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

    const res = await Request(createUserMutation, { data: input });

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

    const res = await Request(createUserMutation, { data: input });

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
