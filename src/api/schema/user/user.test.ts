import { createRequest } from '@test/create-request';
import { expect } from 'chai';

import { Authenticator } from '@api/server/authenticator';
import { UserType } from './user.type';
import { UserSeed } from '@data/seed/user.seed';

const userQuery = `
query user ($id: String!) {
  user(id : $id) { ${UserType.propertiestoString()} }
}`;

describe('GraphQL: User - query user', () => {
  it('should return a user without addresses', async () => {
    let [user] = await UserSeed(1, 0);

    const token = await Authenticator.getTestToken();
    const res = await createRequest(userQuery, { id: user.id }, token);

    expect(res.body).to.not.own.property('errors');
    expect(res.body.data.user.addresses).to.have.lengthOf(0);
    expect(res.body.data.user).to.include({
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate.toISOString(),
    });
  });

  it('should return a user with 3 addresses', async () => {
    let [user] = await UserSeed(1, 3);

    const token = await Authenticator.getTestToken();
    const res = await createRequest(userQuery, { id: user.id }, token);

    expect(res.body).to.not.own.property('errors');
    expect(res.body.data.user).to.include({
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate.toISOString(),
    });

    const addresses = res.body.data.user.addresses;
    expect(addresses).to.have.lengthOf(3);
    for (let i = 0; i < addresses.length; i++) {
      expect(addresses[i]).to.be.deep.eq({
        id: user.addresses[i].id,
        label: user.addresses[i].label,
        cep: user.addresses[i].cep,
        street: user.addresses[i].street,
        streetNumber: user.addresses[i].streetNumber,
        complement: user.addresses[i].complement,
        neighborhood: user.addresses[i].neighborhood,
        city: user.addresses[i].city,
        state: user.addresses[i].state,
      });
    }
  });

  it('should trigger unknown user error', async () => {
    const token = await Authenticator.getTestToken();
    const res = await createRequest(userQuery, { id: '00000000-0000-0000-0000-000000000000' }, token);

    expect(res.body.data).to.be.null;
    expect(res.body.errors).to.deep.include({
      code: 404,
      message: 'Usuário inexistente',
    });
  });

  it('should trigger token not sent error', async () => {
    let [user] = await UserSeed(1, 0);

    const res = await createRequest(userQuery, { id: user.id });

    expect(res.body.data).to.be.null;
    expect(res.body.errors).to.deep.include({
      code: 401,
      message: 'Usuário não autorizado',
      details: 'Token não enviado',
    });
  });

  it('should trigger expired token error', async () => {
    let [user] = await UserSeed(1, 0);

    const res = await createRequest(
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
    let [user] = await UserSeed(1, 0);

    const res = await createRequest(
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
