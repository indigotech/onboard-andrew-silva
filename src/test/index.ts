import supertest from 'supertest';
import { expect } from 'chai'
import { Connection } from '@data/config/connection';
import { Server } from 'server';

const url = `http://localhost:3000`;
const request = supertest(url);

before(async () => {
  await Connection()
  await Server()
})

describe('GraphQL Tests', () => {
  it('Calling hello query', (done) => {
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
