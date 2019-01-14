const {
  topicData, userData, articleData, commentData,
} = require('../data/development-data/index');

exports.seed = function (knex, Promise) {
  return knex('topics')
    .insert(topicData)
    .then(() => knex('users').insert(userData))
    .then(() => knex('articles').insert(articleData))
    .then(() => knex('comments').insert(commentData));
};
