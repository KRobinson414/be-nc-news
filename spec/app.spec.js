process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);
const connection = require('../db/connection');

describe('/api', () => {
  beforeEach(() => connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => connection.destroy());

  describe('/topics', () => {
    it('GET status:200 responds with an array of topic objects', () => request
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).to.be.an('array');
        expect(body.topics[0]).to.haveOwnProperty('slug');
        expect(body.topics[0]).to.haveOwnProperty('description');
      }));
    it('POST status:201 responds with the posted topic object', () => request
      .post('/api/topics')
      .send({ slug: 'Katie', description: 'Just me' })
      .expect(201)
      .then(({ body }) => {
        expect(body.topic).to.be.an('object');
        expect(body.topic).to.haveOwnProperty('slug');
        expect(body.topic).to.haveOwnProperty('description');
        expect(body.topic.slug).to.equal('Katie');
        expect(body.topic.description).to.equal('Just me');
      }));
    it('GET status:200 responds with an array of article objects for the given topic', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles.length).to.equal(10);
        expect(body.articles[0].article_id).to.equal(1);
      }));
    it('GET status:200 responds to limit and offset queries', () => request
      .get('/api/topics/mitch/articles?p=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles.length).to.equal(1);
        expect(body.articles[0].article_id).to.equal(12);
      }));
    it('GET status:200 responds to sort_by and sort_order queries', () => request
      .get('/api/topics/mitch/articles?sort_by=votes?sort_order=desc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles.length).to.equal(10);
        expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
      }));
  });

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
});

// HANDLING 404 IN CONTROLLER
// if !(mp) return Promise.reject({status:404, message: 'MP not found'})
