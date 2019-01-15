const env = process.env.NODE_ENV || 'development';

const knex = require('knex');

const dbConfig = require('../knexfile')[env];

const connection = knex(dbConfig);

module.exports = connection;
