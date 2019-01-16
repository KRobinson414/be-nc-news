const topicsRouter = require('express').Router();
const {
  sendTopics,
  createTopic,
  sendArticlesByTopic,
  createArticleByTopic,
} = require('../controllers/topics');
const { handle405 } = require('../errors');

topicsRouter.route('/').get(sendTopics);
topicsRouter.route('/:topic/articles').get(sendArticlesByTopic);

topicsRouter.route('/').post(createTopic);
topicsRouter.route('/:topic/articles').post(createArticleByTopic);

topicsRouter.route('/').all(handle405);
topicsRouter.route('/:topic/articles').all(handle405);

module.exports = topicsRouter;
