process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);
const connection = require('../db/connection');

describe('/api', () => {
  beforeEach(() => connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => connection.destroy());

  describe('/topics', () => {
    it ('GET status:200 responds with an array of topic objects', () => {
      request.get('/api/topics')
      .expect(200)
      .then(({body}) => {
        expect(body.topics).to.be.an('array');
        expect(body.topics[0]).to.haveOwnProperty('slug');
        expect(body.topics[0]).to.haveOwnProperty('description');
      })
    })
  })

  // LECTURE NOTES
//   describe('/parties', () => {
//     it('GET status:200 should respond with an array of party objects', () => request
//       .get('/api/parties')
//       .expect(200)
//       .then(({ body }) => {
//         expect(body.parties).to.be.an('array');
//         expect(body.parties[0]).to.haveOwnProperty('party');
//         expect(body.parties[0]).to.haveOwnProperty('founded');
//       }));
//     it('POST status:400 client uses a malformed body (properties missing)', () => request
//       .get('/api/parties')
//       .send({ animal: 'giraffe' })
//       .expect(400));
//   });
//   describe('/mps/:mp_id', () => {
//     it('GET status:200 responds with a single MP object', () => request
//       .get('/api/mps/3')
//       .expect(200)
//       .then(({ body }) => {
//         expect(body.mp.name).to.equal('Maggie Throup');
//       }));
//     it('GET status:404 client uses non-existent mp_id', () => request
//       .get('/api/mps/1000')
//       .expect(404)
//       .then(({ body }) => {
//         expect(body.message).to.equal('MP not found');
//       }));
//     it('GET status:400 client uses an invalid mp_id', () => request.get('/api/mps/grape').expect(400));
//   });
// });

// HANDLING 404 IN CONTROLLER
// if !(mp) return Promise.reject({status:404, message: 'MP not found'})
