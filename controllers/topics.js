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
    limit = 10,
    p = 1,
    order_by = 'created_at',
    sort_order = 'desc',
    ...restArts
  } = req.query;
  const { topic } = req.params;
  let pageOffset = 0;
  if (p >= 2) pageOffset = p * limit - limit;
  connection('articles')
    // .innerJoin('topics', 'articles.topic', 'topics.slug')
    .select('*')
    .where({ topic })
    .limit(limit)
    .offset(pageOffset)
    .orderBy(order_by, sort_order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
