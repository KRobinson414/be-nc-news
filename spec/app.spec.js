process.env.NODE_ENV = 'test';
const { expect } = require('chai');
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

    it('POST status:400 client sends mal-formed req.body', () => request
      .post('/api/topics')
      .send({ slug: 'Katie' })
      .expect(400));

    it('POST status:422 client sends a body with a duplicate slug', () => request
      .post('/api/topics')
      .send({ slug: 'mitch', description: 'The man, the Mitch, the legend' })
      .expect(422));

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

    it('GET status:200 limit query', () => request
      .get('/api/topics/mitch/articles?limit=5')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles.length).to.equal(5);
        expect(body.articles[4].article_id).to.equal(6);
      }));

    it('GET status:200 responds with defaults when passed an invalid limit query', () => request
      .get('/api/topics/mitch/articles?limit=purple')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).to.equal(10);
      }));

    it('GET status:200 offset query', () => request
      .get('/api/topics/mitch/articles?p=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles.length).to.equal(1);
        expect(body.articles[0].article_id).to.equal(12);
      }));

    it('GET status:200 responds with defaults when passed an invalid offset query', () => request
      .get('/api/topics/mitch/articles?p=purple')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).to.equal(10);
        expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
      }));

    it('GET status:200 sort_by query', () => request
      .get('/api/topics/mitch/articles?sort_by=articles.created_by')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles.length).to.equal(10);
        expect(body.articles[3].author).to.equal('icellusedkars');
      }));

    it('GET status:400 invalid sort_by query', () => request.get('/api/topics/mitch/articles?sort_by=cats').expect(400));

    it('GET status:200 order query', () => request
      .get('/api/topics/mitch/articles?order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles.length).to.equal(10);
        expect(body.articles[0].title).to.equal('Moustache');
      }));

    it('GET status:200 responds with defaults when passed an invalid order query', () => request
      .get('/api/topics/mitch/articles?order=5')
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

    it('POST status:404 client adds an article to a non-existent topic', () => request
      .post('/api/topics/dogs/articles')
      .send({
        title: 'Shitter dogs',
        created_by: 'rogersop',
        body: 'You sort of do all the things you can do with dogs. But shitter.',
      })
      .expect(404));

    it('POST status:400 client sends mal-formed req.body', () => request
      .post('/api/topics/cats/articles')
      .send({
        created_by: 'rogersop',
        body: 'You sort of do all the things you can do with dogs. But shitter.',
      })
      .expect(400));

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

    it('GET status:200 limit query', () => request
      .get('/api/articles?limit=12')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles.length).to.equal(12);
        expect(body.articles[0].article_id).to.equal(1);
      }));

    it('GET status:200 responds with defaults when passed an invalid limit query', () => request
      .get('/api/articles?limit=boo')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles.length).to.equal(10);
        expect(body.articles[0].article_id).to.equal(1);
      }));

    it('GET status:200 offset query', () => request
      .get('/api/articles?p=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles.length).to.equal(2);
        expect(body.articles[0].article_id).to.equal(11);
      }));

    it('GET status:200 responds with defaults when passed an invalid offset query', () => request
      .get('/api/articles?offset=beer')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles.length).to.equal(10);
        expect(body.articles[0].article_id).to.equal(1);
      }));

    it('GET status:200 sort_by query', () => request
      .get('/api/articles?sort_by=author')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].author).to.equal('rogersop');
      }));

    it('GET status:400 invalid sort_by query', () => request.get('/api/articles?sort_by=favourites').expect(400));

    it('GET status:200 order query', () => request
      .get('/api/articles?order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].author).to.equal('butter_bridge');
      }));

    it('GET status:200 responds with defaults when passed an invalid order query', () => request
      .get('/api/articles?order=5')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
      }));

    it('POST status:405 handles invalid request', () => request
      .post('/api/articles')
      .send({ slug: 'Smoothies', description: 'drinkable fruit' })
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Invalid method for this endpoint');
      }));

    it('PATCH status:405 handles invalid request', () => request
      .patch('/api/articles')
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Invalid method for this endpoint');
      }));

    it('PUT status:405 handles invalid request', () => request
      .put('/api/articles')
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Invalid method for this endpoint');
      }));

    it('DELETE status:405 handles invalid request', () => request
      .delete('/api/articles')
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Invalid method for this endpoint');
      }));
  });

  // ARTICLES/:ARTICLE_ID
  describe.only('/api/articles/:article_id', () => {
    it('GET status:200 responds with an article object matching the given article_id', () => request
      .get('/api/articles/11')
      .expect(200)
      .then(({ body }) => {
        expect(body.article).to.have.keys(
          'article_id',
          'author',
          'title',
          'votes',
          'body',
          'created_at',
          'topic',
          'comment_count',
        );
        expect(body.article.title).to.equal('Am I a cat?');
      }));

    it('GET status:400 client uses non-existent article_id', () => request
      .get('/api/articles/23')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).to.equal('Article not found');
      }));

    it('PATCH status:200 responds with an article object with the vote updated by the passed amount', () => request
      .patch('/api/articles/12')
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).to.have.keys(
          'article_id',
          'created_by',
          'title',
          'votes',
          'body',
          'created_at',
          'topic',
        );
        expect(body.article.title).to.equal('Moustache');
        expect(body.article.votes).to.equal(5);
      }));

    it('PATCH status:404 client sends the inc_votes in the wrong format', () => request
      .patch('/api/article/12')
      .send({ vote: 5 })
      .expect(404));

    it('PATCH status:404 client uses non-existent article_id', () => request
      .patch('/api/articles/27')
      .send({ inc_votes: 5 })
      .expect(404));

    it('DELETE status:204 deletes the article object and responds with no content', () => request
      .delete('/api/articles/1')
      .expect(204)
      .then(({ body }) => {
        expect(body).to.eql({});
        return connection('articles').where('article_id', 1);
      })
      .then(([article]) => {
        expect(article).to.equal(undefined);
      }));

    it('DELETE status:204 client uses non-existent article_id', () => request.delete('/api/articles/200').expect(204));
  });

  // ARTICLES/:ARTICLE_ID/COMMENTS
  describe('/api/articles/:article_id/comments', () => {
    it('GET status:200 responds with an array of comment objects belonging to the passed article_id', () => request
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.be.an('array');
        expect(body.comments.length).to.equal(10);
        expect(body.comments[0].comment_id).to.equal(2);
      }));

    it('GET status:200 limit query', () => request
      .get('/api/articles/1/comments?limit=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.be.an('array');
        expect(body.comments.length).to.equal(2);
      }));

    it('GET status:200 responds with defaults when passed an invalid limit query', () => request
      .get('/api/articles/1/comments?limit=purple')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).to.equal(10);
      }));

    it('GET status:200 offset query', () => request
      .get('/api/articles/1/comments?p=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.be.an('array');
        expect(body.comments.length).to.equal(3);
        expect(body.comments[2].body).to.equal('This morning, I showered for nine minutes.');
      }));

    it('GET status:200 responds with defaults when passed an invalid offset query', () => request
      .get('/api/articles/1/comments?p=purple')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).to.equal(10);
        expect(body.comments[0].comment_id).to.equal(2);
      }));

    it('GET status:200 sort_by query', () => request
      .get('/api/articles/1/comments?sort_by=comment_id')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.be.an('array');
        expect(body.comments.length).to.equal(10);
        expect(body.comments[0].comment_id).to.equal(18);
      }));

    it('GET status:400 invalid sort_by query', () => request.get('/api/articles/1/comments?sort_by=cats').expect(400));

    it('GET status:200 order query', () => request
      .get('/api/articles/1/comments?order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.be.an('array');
        expect(body.comments.length).to.equal(10);
        expect(body.comments[0].comment_id).to.equal(18);
      }));

    it('GET status:200 responds with defaults when passed an invalid order query', () => request
      .get('/api/articles/1/comments?order=5')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0].comment_id).to.equal(2);
      }));

    it('POST status:201 responds with the posted comment object', () => request
      .post('/api/articles/2/comments')
      .send({ created_by: 'butter_bridge', body: 'Laptops are pretty cool.' })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).to.have.keys(
          'article_id',
          'comment_id',
          'created_by',
          'body',
          'votes',
          'created_at',
        );
      }));

    it('POST status:400 client uses non-existent article_id', () => request
      .post('/api/articles/23/comments')
      .send({ created_by: 'butter_bridge', body: 'I have something to say' })
      .expect(400));

    it('POST status:400 send the comment in the wrong format', () => request
      .post('/api/articles/23/comments')
      .send('I do not like this article.')
      .expect(400));
  });

  // ARTICLES/:ARTICLE_ID/COMMENTS/:COMMENT_ID
  describe('/api/articles/:article_id/comments/:comment_id', () => {
    it('PATCH status:200 responds with an article object with the vote updated by the passed amount', () => request
      .patch('/api/articles/1/comments/5')
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.created_by).to.equal('icellusedkars');
        expect(body.comment.votes).to.equal(10);
      }));

    it('PATCH status:404 client uses non-existent comment_id', () => request
      .patch('/api/articles/1/comments/68')
      .send({ inc_votes: 10 })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).to.equal('Comment not found');
      }));

    it('PATCH status:404 client uses non-existent article_id', () => request
      .patch('/api/articles/68/comments/1')
      .send({ inc_votes: 10 })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).to.equal('Comment not found');
      }));

    it('PATCH status:404 client sends the inc_votes in the wrong format', () => request
      .patch('/api/article/1/comments/5')
      .send({ vote: 5 })
      .expect(404));

    it('DELETE status:204 deletes the comment object and responds with no content', () => request
      .delete('/api/articles/1/comments/5')
      .expect(204)
      .then(({ body }) => {
        expect(body).to.eql({});
        return connection('comments').where('comment_id', 5);
      })
      .then(([comment]) => {
        expect(comment).to.equal(undefined);
      }));

    it('DELETE status:204 client uses non-existent article_id', () => request.delete('/api/articles/200/comments/1').expect(204));

    it('DELETE status:204 client uses non-existent comment_id', () => request.delete('/api/articles/1/comments/200').expect(204));
  });

  // USERS
  describe('/api/users', () => {
    it('GET status:200 responds with an array of user objects', () => request
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body).to.be.an('object');
      }));

    it('POST status:405 handles invalid request', () => request
      .post('/api/users')
      .send({ username: 'Rusty414', avatar_url: 'www.awesomepicture.com', name: 'Katie' })
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Invalid method for this endpoint');
      }));

    it('PATCH status:405 handles invalid request', () => request
      .patch('/api/users')
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Invalid method for this endpoint');
      }));

    it('PUT status:405 handles invalid request', () => request
      .put('/api/users')
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Invalid method for this endpoint');
      }));

    it('DELETE status:405 handles invalid request', () => request
      .delete('/api/users')
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Invalid method for this endpoint');
      }));
  });

  // USERS/:USERNAME
  describe('/api/users/:username', () => {
    it('GET status:200 responds with a user object matching the given username', () => request
      .get('/api/users/butter_bridge')
      .expect(200)
      .then(({ body }) => {
        expect(body.user).to.have.keys('username', 'avatar_url', 'name');
        expect(body.user.name).to.equal('jonny');
      }));

    it('GET status:404 client uses non-existent username', () => request
      .get('/api/users/rusty414')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).to.equal('User not found');
      }));

    it('POST status:405 handles invalid request', () => request
      .post('/api/users/butter_bridge')
      .send({ username: 'Rusty414', avatar_url: 'www.awesomepicture.com', name: 'Katie' })
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Invalid method for this endpoint');
      }));

    it('PATCH status:405 handles invalid request', () => request
      .patch('/api/users/butter_bridge')
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Invalid method for this endpoint');
      }));

    it('PUT status:405 handles invalid request', () => request
      .put('/api/users/butter_bridge')
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Invalid method for this endpoint');
      }));

    it('DELETE status:405 handles invalid request', () => request
      .delete('/api/users/butter_bridge')
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Invalid method for this endpoint');
      }));
  });

  // API
  describe('/api', () => {
    it('GET status:200 responds with a JSON describing all available endpoints', () => request.get('/api').then(({ body }) => {
      expect(body).to.be.an('object');
    }));
  });
});
