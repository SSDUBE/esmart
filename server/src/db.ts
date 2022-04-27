import Knex from 'knex';
// import { knexSnakeCaseMappers } from 'objection';

import config from './config';

const { user, password, database, debug, port, host } = config.get('db');

export const connection = {
  host,
  user,
  port,
  password,
  database,
};

// Initialize knex.
export const knex = Knex({
  debug,
  client: 'pg',
  connection,
  // ...knexSnakeCaseMappers(),
});
