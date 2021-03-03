import supertest from 'supertest';
import faker from 'faker';
import gql from 'graphql-tag';

import { expect } from 'chai';

import { Connection } from '@data/config/connection';
import { Server } from 'server';

import { UserInput } from '@api/modules/user/user.input';
import { UserType } from '@api/modules/user/user.type';
import { UserEntity } from '@data/entity/user.entity';

const seed: number = 0;
const url: string = `http://localhost:3000`;
const request = supertest(url);

let connection: any;
let server: any;

before(async () => {
  connection = await Connection();
  server = await Server();
});

describe('GraphQL: Hello query', () => {
  it('should return "👋 Hello world! 👋"', (done) => {
    request
      .post('/')
      .send({
        query: '{ hello }',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.data).to.be.deep.eq({ hello: '👋 Hello world! 👋' });
        done();
      });
  });
});

describe('GraphQL: User - createUser', () => {
  const mutation = `
    mutation createUser($data: UserInput!) {
      createUser(data: $data) {
        id name email birthDate
      }
    }
  `;

  it('should create user successfully', (done) => {
    faker.seed(seed);

    const input: UserInput = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: 'a1' + faker.internet.password(),
      birthDate: faker.date.past(),
    };

    request
      .post('/')
      .send({
        query: mutation,
        variables: {
          data: input,
        },
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        }
        // Check response
        expect(res.body).to.not.own.property('errors');
        expect(res.body.data.createUser).to.have.property('id');
        expect(res.body.data.createUser).to.include({
          name: input.name,
          email: input.email,
          birthDate: input.birthDate.toISOString(),
        });
        // Check database
        const user = await UserEntity.findOne(res.body.data.createUser.id);
        expect(user).to.not.be.equal(undefined);
        expect(user).to.not.include({ password: input.password });
        done();
      });
  });
});

after(async () => {
  const entities = connection.entityMetadatas;

  for (const entity of entities) {
    const repository = await connection.getRepository(entity.name);
    await repository.clear();
  }
});
