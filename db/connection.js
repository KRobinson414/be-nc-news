const env = process.env.NODE_ENV || 'development';

const knex = require('knex');

const dbConfig = env === 'production'
  ? { client: 'pg', connection: process.env.DATABASE_URL }
  : require('../knexfile')[env];

const connection = knex(dbConfig);

module.exports = connection;
