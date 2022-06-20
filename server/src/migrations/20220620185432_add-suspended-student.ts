import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable('Student')) {
    await knex.schema.alterTable('Student', (table) => {
      table.boolean('suspended').defaultTo(false)
    });
  }

  if (await knex.schema.hasTable('Scrumble')) {
    await knex.schema.alterTable('Scrumble', (table) => {
      table.integer('wordLength')
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable('Student')) {
    await knex.schema.alterTable('Student', (table) => {
      table.dropColumn('suspended')
    });
  }

  if (await knex.schema.hasTable('Scrumble')) {
    await knex.schema.alterTable('Scrumble', (table) => {
      table.dropColumn('wordLength')
    });
  }
}
