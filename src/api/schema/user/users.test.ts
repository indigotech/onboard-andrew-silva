import { createRequest } from '@test/create-request';
import { expect } from 'chai';
import { UserSeed } from '@data/seed/user.seed';
import { UserType } from './user.type';

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
    expect(res.body.data.users).to.have.lengthOf(10);

    const reorderedUsers = res.body.data.users;
    reorderedUsers.sort((userA: UserType, userB: UserType) => {
      var nameA = userA.name.toUpperCase();
      var nameB = userB.name.toUpperCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    });

    for (let i = 0; i < res.body.data.users.length; i++) {
      expect(res.body.data.users[i]).to.have.all.keys('id', 'name', 'email', 'birthDate');
      expect(res.body.data.users[i]).to.be.eq(reorderedUsers[i]);
    }
  });

  it('should successfully return 5 users with a defined limit', async () => {
    await UserSeed(10);

    const res = await createRequest(usersQuery, { limit: 5 });

    expect(res.body).to.not.own.property('errors');
    expect(res.body.data.users).to.have.lengthOf(5);

    const reorderedUsers = res.body.data.users;
    reorderedUsers.sort((userA: UserType, userB: UserType) => {
      var nameA = userA.name.toUpperCase();
      var nameB = userB.name.toUpperCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    });

    for (let i = 0; i < res.body.data.users.length; i++) {
      expect(res.body.data.users[i]).to.have.all.keys('id', 'name', 'email', 'birthDate');
      expect(res.body.data.users[i]).to.be.eq(reorderedUsers[i]);
    }
  });

  it('it should successfully return 10 users with an overly defined limit', async () => {
    await UserSeed(10);

    const res = await createRequest(usersQuery, { limit: 100 });

    expect(res.body).to.not.own.property('errors');
    expect(res.body.data.users).to.have.lengthOf(10);

    const reorderedUsers = res.body.data.users;
    reorderedUsers.sort((userA: UserType, userB: UserType) => {
      var nameA = userA.name.toUpperCase();
      var nameB = userB.name.toUpperCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    });

    for (let i = 0; i < res.body.data.users.length; i++) {
      expect(res.body.data.users[i]).to.have.all.keys('id', 'name', 'email', 'birthDate');
      expect(res.body.data.users[i]).to.be.eq(reorderedUsers[i]);
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
