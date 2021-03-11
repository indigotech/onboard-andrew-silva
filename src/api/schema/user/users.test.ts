import { createRequest } from '@test/create-request';
import { expect } from 'chai';
import { UserSeed } from '@data/seed/user.seed';
import { UserType } from './user.type';
import { UserEntity } from '@data/entity/user.entity';

const usersQuery = `
query users ($limit: Int) {
  users(limit : $limit) {
    id
    name
    email
    birthDate
  }
}`;

describe('GraphQL: User - query users', function () {
  this.timeout(5000);

  it('should successfully return 10 users without a defined limit', async () => {
    await UserSeed(10);

    const res = await createRequest(usersQuery);

    expect(res.body).to.not.own.property('errors');

    const users = await UserEntity.find({
      order: { name: 'ASC' },
      take: 10,
    });

    expect(res.body.data.users.length).to.be.eq(users.length);

    for (let i = 0; i < users.length; i++) {
      expect(res.body.data.users[i]).to.be.deep.eq({
        id: users[i].id,
        name: users[i].name,
        email: users[i].email,
        birthDate: users[i].birthDate.toISOString(),
      });
    }
  });

  it('should successfully return 5 users with a defined limit', async () => {
    await UserSeed(10);

    const res = await createRequest(usersQuery, { limit: 5 });

    expect(res.body).to.not.own.property('errors');

    const users = await UserEntity.find({
      order: { name: 'ASC' },
      take: 5,
    });

    expect(res.body.data.users.length).to.be.eq(users.length);

    for (let i = 0; i < users.length; i++) {
      expect(res.body.data.users[i]).to.be.deep.eq({
        id: users[i].id,
        name: users[i].name,
        email: users[i].email,
        birthDate: users[i].birthDate.toISOString(),
      });
    }
  });

  it('it should successfully return 10 users with an overly defined limit', async () => {
    await UserSeed(10);

    const res = await createRequest(usersQuery, { limit: 100 });

    expect(res.body).to.not.own.property('errors');

    const users = await UserEntity.find({
      order: { name: 'ASC' },
      take: 100,
    });

    expect(res.body.data.users.length).to.be.eq(users.length);

    for (let i = 0; i < users.length; i++) {
      expect(res.body.data.users[i]).to.be.deep.eq({
        id: users[i].id,
        name: users[i].name,
        email: users[i].email,
        birthDate: users[i].birthDate.toISOString(),
      });
    }
  });

  it('it should trigger non-positive error', async () => {
    const res = await createRequest(usersQuery, { limit: -10 });

    expect(res.body.data).to.be.null;
    expect(res.body.errors).to.deep.include({
      code: 400,
      message: 'O limite não pode ser negativo',
    });
  });

  it('it should trigger non-integer error', async () => {
    const res = await createRequest(usersQuery, { limit: 4.2 }, undefined, 400);
    expect(res.body.errors[0].message).to.includes('Int cannot represent non-integer value');
  });
});
