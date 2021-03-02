import supertest from 'supertest';

const url = `http://localhost:3000`;
const request = supertest(url);

describe('GraphQL Tests', () => {
  it('Fetching users', (done) => {
    request
      .post('/graphql')
      .send({
        query: '{ users { id, name, email, birthDate } }',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});
