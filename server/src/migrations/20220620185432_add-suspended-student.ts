import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable('Student')) {
    await knex.schema.alterTable('Student', (table) => {
      table.boolean('suspended').defaultTo(false)
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable('Student')) {
    await knex.schema.alterTable('Student', (table) => {
      table.dropColumn('suspended')
    });
  }
}
