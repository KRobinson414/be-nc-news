const connection = require('../db/connection');

exports.sendUsers = (req, res, next) => {
  connection('users')
    .select('username', 'avatar_url', 'name')
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.sendUserByUsername = (req, res, next) => {
  const { username } = req.params;
  connection('users')
    .select('username', 'avatar_url', 'name')
    .where({ username })
    .then(([user]) => {
      if (user === undefined) return Promise.reject({ status: 404, message: 'User not found' });
      res.status(200).send({ user });
    })
    .catch(next);
};
