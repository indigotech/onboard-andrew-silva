import { createRequest } from '@test/create-request';
import { expect } from 'chai';

import { UserEntity } from '@data/entity/user.entity';
import { Authenticator } from '@api/server/authenticator';
import { UserType } from './user.type';

const userQuery = `
query user ($id: String!) {
  user(id : $id) { ${UserType.propertiestoString()} }
}`;

describe('GraphQL: User - query user', () => {
  it('should successfully return a user', async () => {
    const user = UserEntity.create({
      name: 'Padmé Amidala',
      email: 'padmeia@yahoo.com',
      password: 'padead123',
      birthDate: new Date(),
    });
    await user.save();

    const token = await Authenticator.getTestToken();
    const res = await createRequest(userQuery, { id: user.id }, token);

    expect(res.body).to.not.own.property('errors');
    expect(res.body.data.user).to.include({
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate.toISOString(),
    });
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
    const user = UserEntity.create({
      name: 'Padmé Amidala',
      email: 'padmeia@yahoo.com',
      password: 'padead123',
      birthDate: new Date(),
    });
    await user.save();

    const res = await createRequest(userQuery, { id: user.id });

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
    const user = UserEntity.create({
      name: 'Padmé Amidala',
      email: 'padmeia@yahoo.com',
      password: 'padead123',
      birthDate: new Date(),
    });
    await user.save();

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
