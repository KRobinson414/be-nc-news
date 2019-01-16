const connection = require('../db/connection');

exports.sendArticles = (req, res, next) => {
  const {
    limit = 10, p = 1, order_by = 'created_at', sort_order = 'desc',
  } = req.query;
  const pageOffset = (p - 1) * limit;
  connection('articles')
    .select(
      'articles.created_by as author',
      'title',
      'articles.article_id',
      'articles.body',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
    )
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
    .count({ comment_count: 'comments.comment_id' })
    .groupBy('articles.article_id')
    .limit(limit)
    .offset(pageOffset)
    .orderBy(order_by, sort_order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.sendArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  connection('articles')
    .select(
      'articles.article_id',
      'articles.created_by as author',
      'title',
      'articles.votes',
      'articles.body',
      'articles.created_at',
      'articles.topic',
    )
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
    .count({ comment_count: 'comments.comment_id' })
    .groupBy('articles.article_id')
    .where('articles.article_id', article_id)
    .then((articles) => {
      if (articles.length === 0) return Promise.reject({ status: 404, message: 'Article not found' });
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.addVoteToArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  connection('articles')
    .select('*')
    .increment('votes', inc_votes)
    .returning('*')
    .where({ article_id })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};
