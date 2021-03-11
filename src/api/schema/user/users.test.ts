import { createRequest } from '@test/create-request';
import { expect } from 'chai';
import { UserSeed } from '@data/seed/user.seed';
import { UserEntity } from '@data/entity/user.entity';

const usersQuery = `
query users($page: PageInput) {
  users(page: $page) {
    page {
      count
      offset
      limit
      hasNextPage
      hasPreviousPage
    }
    users {
      id
      name
      email
      birthDate
    }
  }
}
`;

const sortUsersByName = (users: UserEntity[]): UserEntity[] => {
  const sorted = [...users];
  sorted.sort((userA, userB) => {
    var nameA = userA.name.toUpperCase();
    var nameB = userB.name.toUpperCase();
    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
  });
  return sorted;
};

describe('GraphQL: User - query users', function () {
  this.timeout(5000);

  it('should successfully return 10 users without defining a page', async () => {
    let seedUsers = await UserSeed(10);
    seedUsers = sortUsersByName(seedUsers);

    const res = await createRequest(usersQuery);

    expect(res.body).to.not.own.property('errors');

    const users = res.body.data.users.users;
    const page = res.body.data.users.page;

    expect(users.length).to.be.eq(seedUsers.length);
    expect(page).to.be.deep.eq({
      count: 10,
      offset: 0,
      limit: 10,
      hasNextPage: false,
      hasPreviousPage: false,
    });

    for (let i = 0; i < seedUsers.length; i++) {
      expect(users[i]).to.be.deep.eq({
        id: seedUsers[i].id,
        name: seedUsers[i].name,
        email: seedUsers[i].email,
        birthDate: seedUsers[i].birthDate.toISOString(),
      });
    }
  });

  it('should successfully return 5 users from beginning defining a limit', async () => {
    let seedUsers = await UserSeed(10);
    seedUsers = sortUsersByName(seedUsers);
    seedUsers = seedUsers.slice(0, 5);

    const res = await createRequest(usersQuery, { page: { limit: 5 } });

    expect(res.body).to.not.own.property('errors');

    const users = res.body.data.users.users;
    const page = res.body.data.users.page;

    expect(users.length).to.be.eq(seedUsers.length);
    expect(page).to.be.deep.eq({
      count: 10,
      offset: 0,
      limit: 5,
      hasNextPage: true,
      hasPreviousPage: false,
    });

    for (let i = 0; i < seedUsers.length; i++) {
      expect(users[i]).to.be.deep.eq({
        id: seedUsers[i].id,
        name: seedUsers[i].name,
        email: seedUsers[i].email,
        birthDate: seedUsers[i].birthDate.toISOString(),
      });
    }
  });

  it('should successfully return 8 users defining an offset and a limit', async () => {
    let seedUsers = await UserSeed(10);
    seedUsers = sortUsersByName(seedUsers);
    seedUsers = seedUsers.slice(2, 7);

    const res = await createRequest(usersQuery, { page: { offset: 2, limit: 5 } });

    expect(res.body).to.not.own.property('errors');

    const users = res.body.data.users.users;
    const page = res.body.data.users.page;

    expect(users.length).to.be.eq(seedUsers.length);
    expect(page).to.be.deep.eq({
      count: 10,
      offset: 2,
      limit: 5,
      hasNextPage: true,
      hasPreviousPage: true,
    });

    for (let i = 0; i < seedUsers.length; i++) {
      expect(users[i]).to.be.deep.eq({
        id: seedUsers[i].id,
        name: seedUsers[i].name,
        email: seedUsers[i].email,
        birthDate: seedUsers[i].birthDate.toISOString(),
      });
    }
  });

  it('it should successfully return all users defining no limit', async () => {
    let seedUsers = await UserSeed(10);
    seedUsers = sortUsersByName(seedUsers);

    const res = await createRequest(usersQuery, { page: { limit: 0 } });

    expect(res.body).to.not.own.property('errors');

    const users = res.body.data.users.users;
    const page = res.body.data.users.page;

    expect(page).to.be.deep.eq({
      count: 10,
      offset: 0,
      limit: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });

    expect(users.length).to.be.eq(seedUsers.length);

    for (let i = 0; i < seedUsers.length; i++) {
      expect(users[i]).to.be.deep.eq({
        id: seedUsers[i].id,
        name: seedUsers[i].name,
        email: seedUsers[i].email,
        birthDate: seedUsers[i].birthDate.toISOString(),
      });
    }
  });

  it('it should trigger non-positive error', async () => {
    const res = await createRequest(usersQuery, { page: { offset: -5, limit: -10 } });

    expect(res.body.data).to.be.null;

    const errorMessages = res.body.errors.map((error: { message: string }) => error.message);
    expect(errorMessages).to.include('Argumentos inválidos');
    const errorIndex = errorMessages.indexOf('Argumentos inválidos');

    expect(res.body.errors[errorIndex]).to.own.property('details');
    expect(res.body.errors[errorIndex].details).to.include(
      'O número de elementos ignorados precisa ser igual ou maior que zero',
    );
    expect(res.body.errors[errorIndex].details).to.include('O número limite precisa ser igual ou maior que zero');
  });

  it('it should trigger non-integer error', async () => {
    const res = await createRequest(usersQuery, { page: { offset: 4.2 } }, undefined, 400);
    expect(res.body.errors[0].message).to.includes('Int cannot represent non-integer value');
  });
});
