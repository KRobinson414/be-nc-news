const topicsRouter = require('express').Router();
const {
  sendTopics,
  createTopic,
  sendArticlesByTopic,
  createArticleByTopic,
} = require('../controllers/topics');
const { handle405 } = require('../errors');

topicsRouter
  .route('/')
  .get(sendTopics)
  .post(createTopic)
  .all(handle405);

topicsRouter
  .route('/:topic/articles')
  .get(sendArticlesByTopic)
  .post(createArticleByTopic)
  .all(handle405);

module.exports = topicsRouter;
