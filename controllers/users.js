const connection = require('../db/connection');

exports.sendUsers = (req, res, next) => {
  connection('users')
    .select('username', 'avatar_url', 'name')
    .then((users) => {
      res.status(200).send(users);
    });
};

exports.sendUserByUsername = (req, res, next) => {
  const { username } = req.params;
  connection('users')
    .select('username', 'avatar_url', 'name')
    .where({ username })
    .then(([user]) => {
      res.status(200).send({ user });
    });
};
