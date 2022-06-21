import { Knex } from 'knex';

export function auditing(knex: Knex, table: Knex.TableBuilder) {
  table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
  table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable();
}
