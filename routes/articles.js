const articlesRouter = require('express').Router();
const {
  sendArticles,
  sendArticlesById,
  addVoteToArticle,
  deleteArticleById,
  sendCommentsByArticleId,
  addComment,
  addVoteToComment,
  deleteCommentById,
} = require('../controllers/articles');
const { handle405 } = require('../errors');

articlesRouter
  .route('/')
  .get(sendArticles)
  .all(handle405);

articlesRouter
  .route('/:article_id')
  .get(sendArticlesById)
  .patch(addVoteToArticle)
  .delete(deleteArticleById)
  .all(handle405);

articlesRouter
  .route('/:article_id/comments')
  .get(sendCommentsByArticleId)
  .post(addComment)
  .all(handle405);

articlesRouter
  .route('/:article_id/comments/:comment_id')
  .patch(addVoteToComment)
  .delete(deleteCommentById);

module.exports = articlesRouter;
