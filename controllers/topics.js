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
  const { limit = 10, ...restArts } = req.query;
  const { topic } = req.params;
  connection('articles')
    // .innerJoin('topics', 'articles.topic', 'topics.slug')
    .select('*')
    .where({ topic })
    .limit(limit)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
