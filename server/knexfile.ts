import type { Knex } from 'knex';

const { knexSnakeCaseMappers } = require('objection');
const { connection } = require('./src/db');
// const { KNEX_SEED = false } = process.env;

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgres',
    connection,
    pool: {
      min: 2,
      max: 10,
    },
    seeds: {
      directory: './src/seeds/',
    },
    migrations: {
      directory: './src/migrations',
    },
    // ...knexSnakeCaseMappers(),
  },

  staging: {
    client: 'postgresql',
    connection,
    pool: {
      min: 2,
      max: 10,
    },
    seeds: {
      directory: './src/seeds/',
    },
    migrations: {
      directory: './src/migrations',
    },
    // ...knexSnakeCaseMappers(),
  },

  // production: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'esmart',
  //     user: 'username',
  //     password: 'password',
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10,
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations',
  //   },
  // },
};

module.exports = config;
