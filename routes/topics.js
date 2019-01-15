const topicsRouter = require('express').Router();
const { sendTopics, createTopic, sendArticlesByTopic } = require('../controllers/topics');

topicsRouter.route('/').get(sendTopics);
topicsRouter.route('/:topic/articles').get(sendArticlesByTopic);

topicsRouter.route('/').post(createTopic);

module.exports = topicsRouter;
