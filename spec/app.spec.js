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

  // TOPICS
  describe('/topics', () => {
    it('GET status:200 responds with an array of topic objects', () => request
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).to.be.an('array');
        expect(body.topics[0]).to.have.keys('slug', 'description');
      }));
    it('POST status:201 responds with the posted topic object', () => request
      .post('/api/topics')
      .send({ slug: 'Katie', description: 'Just me' })
      .expect(201)
      .then(({ body }) => {
        expect(body.topic).to.be.an('object');
        expect(body.topic).to.have.keys('slug', 'description');
        expect(body.topic.slug).to.equal('Katie');
        expect(body.topic.description).to.equal('Just me');
      }));
    // ERROR FOR WRONG FORMAT?
    it('PATCH status:405 handles invalid request', () => request
      .patch('/api/topics')
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Invalid method for this endpoint');
      }));
    it('PUT status:405 handles invalid request', () => request
      .put('/api/topics')
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Invalid method for this endpoint');
      }));
    it('DELETE status:405 handles invalid request', () => request
      .delete('/api/topics')
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Invalid method for this endpoint');
      }));
  });

  // TOPICS/:TOPIC/ARTICLES
  describe('/topics/:topic/articles', () => {
    it('GET status:200 responds with an array of article objects for the given topic', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles.length).to.equal(10);
        expect(body.articles[0].article_id).to.equal(1);
      }));
    it('GET status:404 client uses non-existent topic', () => request
      .get('/api/topics/dogs/articles')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).to.equal('Topic not found');
      }));
    it('GET status:200 responds to valid limit and offset queries', () => request
      .get('/api/topics/mitch/articles?p=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles.length).to.equal(1);
        expect(body.articles[0].article_id).to.equal(12);
      }));
    it('GET status:200 responds to valid sort_by and sort_order queries', () => request
      .get('/api/topics/mitch/articles?sort_by=votes?sort_order=desc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles.length).to.equal(10);
        expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
      }));
    it('GET status:200 responds with defaults when passed invalid queries', () => request
      .get('/api/topics/mitch/articles?sort_by=bananas')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
      }));
    it('POST status:201 responds with the posted article object', () => request
      .post('/api/topics/cats/articles')
      .send({
        title: 'Shitter dogs',
        created_by: 'rogersop',
        body: 'You sort of do all the things you can do with dogs. But shitter.',
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.article).to.be.an('object');
        expect(body.article.title).to.equal('Shitter dogs');
        expect(body.article.topic).to.equal('cats');
      }));
    // ERROR FOR WRONG FORMAT?
    it('PATCH status:405 handles invalid request', () => request
      .patch('/api/topics/cats/articles')
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Invalid method for this endpoint');
      }));
    it('PUT status:405 handles invalid request', () => request
      .put('/api/topics/cats/articles')
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Invalid method for this endpoint');
      }));
    it('DELETE status:405 handles invalid request', () => request
      .delete('/api/topics/cats/articles')
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Invalid method for this endpoint');
      }));
  });

  // ARTICLES
  describe('/articles', () => {
    it('GET status:200 responds with an array of article objects', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles[0]).to.have.keys(
          'author',
          'title',
          'article_id',
          'body',
          'votes',
          'comment_count',
          'created_at',
          'topic',
        );
      }));
    it('GET status:200 responds to valid limit and offset queries', () => request
      .get('/api/articles?p=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles.length).to.equal(2);
        expect(body.articles[1].article_id).to.equal(12);
      }));
    it('GET status:200 responds to valid sort_by and sort_order queries', () => request
      .get('/api/articles?sort_by=created_by?sort_order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles.length).to.equal(10);
        expect(body.articles[0].author).to.equal('butter_bridge');
      }));
    it('GET status:200 responds with defaults when passed invalid queries', () => request
      .get('/api/articles?sort_by=bananas')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
      }));
  });

  // ARTICLES/:ARTICLE_ID
  describe('/api/articles/:article_id', () => {
    it('GET status:200 responds with an array of article objects by the given article_id', () => request
      .get('/api/articles/11')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).to.equal(1);
        expect(body.articles[0]).to.have.keys(
          'article_id',
          'author',
          'title',
          'votes',
          'body',
          'created_at',
          'topic',
          'comment_count',
        );
        expect(body.articles[0].title).to.equal('Am I a cat?');
      }));
    it('GET status:404 client uses non-existent article_id', () => request
      .get('/api/articles/23')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).to.equal('Article not found');
      }));
    it('PATCH status:201 responds with an article object with the vote updated by the passed amount', () => request
      .patch('/api/articles/12')
      .send({ inc_votes: 5 })
      .expect(201)
      .then(({ body }) => {
        expect(body.article.length).to.equal(1);
        expect(body.article[0]).to.have.keys(
          'article_id',
          'created_by',
          'title',
          'votes',
          'body',
          'created_at',
          'topic',
        );
        expect(body.article[0].title).to.equal('Moustache');
        expect(body.article[0].votes).to.equal(5);
      }));
    // ERROR FOR WRONG FORMAT?
  });
});
