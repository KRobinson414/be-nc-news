const {
  topicData, userData, articleData, commentData,
} = require('../data/development-data/index');
const {
  formatDate, createArtRef, formatComments, formatUsers,
} = require('../utils/index');

exports.seed = function (knex, Promise) {
  return knex('topics')
    .insert(topicData)
    .returning('*')
    .then(() => knex('users')
      .insert(userData)
      .returning('*'))
    .then(() => {
      const formattedArticles = formatDate(articleData);
      return knex('articles')
        .insert(formattedArticles)
        .returning('*');
    })
    .then((artRows) => {
      const artRef = createArtRef(artRows, 'title', 'article_id');
      const formattedArts = formatComments(commentData, artRef);
      const formattedDate = formatDate(formattedArts);
      console.log(formattedDate);
      return knex('comments')
        .insert(formattedDate)
        .returning('*');
    });
};
