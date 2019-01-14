const articles = require('../data/development-data/articles');

exports.formatDate = object => object.map(({ created_at, ...restObject }) => ({
  ...restObject,
  created_at: new Date(created_at),
}));

exports.createArtRef = artRows => artRows.reduce((lookupObj, { title, article_id }) => {
  lookupObj[title] = article_id;
  return lookupObj;
}, {});

exports.formatComments = (commentsData, artRef) => commentsData.map(({ belongs_to, ...restCom }) => ({
  ...restCom,
  article_id: artRef[belongs_to],
}));
