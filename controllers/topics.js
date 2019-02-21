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
    limit, p = 1, sort_by = 'created_at', order,
  } = req.query;

  const { topic } = req.params;
  const pageOffset = (p - 1) * (+limit || 5);
  connection('articles')
    .select(
      'articles.created_by as author',
      'title',
      'articles.article_id',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
      'users.avatar_url',
    )
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
    .fullOuterJoin('users', 'users.username', '=', 'articles.created_by')
    .count({ comment_count: 'comments.comment_id' })
    .groupBy('articles.article_id', 'users.avatar_url')
    .where({ topic })
    .limit(+limit || 5)
    .offset(pageOffset)
    .orderBy(sort_by, order === 'asc' ? 'asc' : 'desc')
    .then((articles) => {
      if (articles.length === 0) return Promise.reject({ status: 404, message: 'Topic not found' });
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.createArticleByTopic = (req, res, next) => {
  const { topic } = req.params;
  connection('articles')
    .select()
    .where('topic', topic)
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
