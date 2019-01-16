const articlesRouter = require('express').Router();
const { sendArticles, sendArticlesById, addVoteToArticle } = require('../controllers/articles');
const { handle405 } = require('../errors');

articlesRouter.route('/').get(sendArticles);
articlesRouter.route('/:article_id').get(sendArticlesById);

articlesRouter.route('/:article_id').patch(addVoteToArticle);

articlesRouter.route('/').all(handle405);

module.exports = articlesRouter;
