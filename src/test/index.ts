import supertest from 'supertest';
import { expect } from 'chai'

const url = `http://localhost:3000`;
const request = supertest(url);

describe('GraphQL Tests', () => {
  it('Calling hello query', (done) => {
    request
      .post('/graphql')
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
        expect(res.body).to.be.an('Object');
        expect(res.body.data).to.have.own.property('hello')
        expect(res.body.data.hello).to.be.eq('👋 Hello world! 👋')
        done();
      });
  });
});
