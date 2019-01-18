const connection = require('../db/connection');

exports.sendArticles = (req, res, next) => {
  const {
    limit, p = 1, order_by = 'created_at', sort_order = 'desc',
  } = req.query;
  const pageOffset = (p - 1) * (+limit || 10);
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
    .limit(+limit || 10)
    .offset(pageOffset)
    .orderBy(order_by, sort_order === 'asc' ? 'asc' : 'desc')
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
      if (article.length === 0) return Promise.reject({ status: 404, message: 'Article not found' });
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  connection('articles')
    .where('articles.article_id', article_id)
    .del()
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
};

exports.sendCommentsByArticleId = (req, res, next) => {
  const {
    limit, p = 1, order_by = 'created_at', sort_order = 'desc',
  } = req.query;
  const { article_id } = req.params;
  const pageOffset = (p - 1) * (+limit || 10);
  connection('comments')
    .select(
      'comments.comment_id',
      'comments.votes',
      'comments.created_at',
      'comments.created_by as author',
      'comments.body',
    )
    .leftJoin('articles', 'articles.article_id', '=', 'comments.article_id')
    .where('comments.article_id', article_id)
    .limit(+limit || 10)
    .offset(pageOffset)
    .orderBy(order_by, sort_order === 'asc' ? 'asc' : 'desc')
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.addComment = (req, res, next) => {
  const { article_id } = req.params;
  connection('comments')
    .insert({ article_id, created_by: req.body.created_by, body: req.body.body })
    .returning('*')
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.addVoteToComment = (req, res, next) => {
  const { comment_id, article_id } = req.params;
  const { inc_votes } = req.body;
  connection('comments')
    .where({ comment_id, article_id })
    .increment('votes', inc_votes)
    .returning('*')
    .then((comment) => {
      if (comment.length === 0) return Promise.reject({ status: 404, message: 'Comment not found' });
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  connection('comments')
    .where({ comment_id })
    .del()
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
};
