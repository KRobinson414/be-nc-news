const connection = require('../db/connection');

exports.sendTopics = (req, res, next) => {
  connection('topics')
    .select('*')
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.createTopic = (req, res, next) => {
  connection('topics')
    .insert(req.body)
    .returning('*')
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};

exports.sendArticlesByTopic = (req, res, next) => {
  const {
    limit, p = 1, order_by = 'created_at', sort_order,
  } = req.query;

  const { topic } = req.params;
  const pageOffset = (p - 1) * limit;
  connection('articles')
    .select(
      'articles.created_by as author',
      'title',
      'articles.article_id',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
    )
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
    .count({ comment_count: 'comments.comment_id' })
    .groupBy('articles.article_id')
    .where({ topic })
    .limit(+limit || 10)
    .offset(pageOffset)
    .orderBy(order_by, sort_order === 'asc' ? 'asc' : 'desc')
    .then((articles) => {
      if (articles.length === 0) return Promise.reject({ status: 404, message: 'Topic not found' });
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.createArticleByTopic = (req, res, next) => {
  const { topic } = req.params;
  connection('articles')
    .insert({
      title: req.body.title,
      topic,
      created_by: req.body.created_by,
      body: req.body.body,
    })
    .returning('*')
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch(next);
};
