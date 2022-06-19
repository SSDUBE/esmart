import { Knex } from 'knex';
import { auditing } from './utils/auditing';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('School', (table: Knex.TableBuilder) => {
    table.increments('schoolID').notNullable().index().primary();
    table.string('schoolName', 50).notNullable();
    table.boolean('active').notNullable().defaultTo(true);
    auditing(knex, table);
  });

  await knex.schema.createTable('Principal', (table: Knex.TableBuilder) => {
    table.string('idNumber', 13).notNullable().unique().primary();
    table.string('firstName', 50).nullable();
    table.string('lastName', 50).nullable();
    table.string('contactNumber', 50).nullable();
    table.string('email', 50).notNullable();
    table.string('roleType', 50).notNullable().defaultTo('PRINCIPAL');
    table.string('password', 100).notNullable();
    table.boolean('active').notNullable().defaultTo(true);
    table.integer('schoolID').references('School.schoolID').notNullable();
    auditing(knex, table);
  });

  await knex.schema.createTable('Teacher', (table: Knex.TableBuilder) => {
    table.string('idNumber', 13).notNullable().unique().primary();
    table.string('firstName', 50).nullable();
    table.string('lastName', 50).nullable();
    table.string('contactNumber', 50).nullable();
    table.string('email', 50).nullable();
    table.string('roleType', 50).notNullable().defaultTo('TEACHER');
    table.string('password', 100).notNullable();
    table.boolean('active').notNullable().defaultTo(true);
    table.integer('schoolID').references('School.schoolID').notNullable();
    auditing(knex, table);
  });

  await knex.schema.createTable('Admin', (table: Knex.TableBuilder) => {
    table.string('idNumber', 13).notNullable().unique().primary();
    table.string('firstName', 50).nullable();
    table.string('lastName', 50).nullable();
    table.string('contactNumber', 50).nullable();
    table.string('email', 50).nullable();
    table.string('roleType', 50).notNullable().defaultTo('ADMIN');
    table.string('password', 100).notNullable();
    table.boolean('active').notNullable().defaultTo(true);
    table.integer('schoolID').references('School.schoolID').nullable();
    auditing(knex, table);
  });

  await knex.schema.createTable('Class', (table: Knex.TableBuilder) => {
    table.increments('classID').notNullable().unique().primary();
    table.string('channel').notNullable().unique();
    table.integer('grade').notNullable();
    auditing(knex, table);
  });

  await knex.schema.createTable('Scrumble', (table: Knex.TableBuilder) => {
    table.increments('scrumbleID').notNullable().unique().primary();
    table.string('word', 50).notNullable();
    auditing(knex, table);
  });

  await knex.schema.createTable('Game', (table: Knex.TableBuilder) => {
    table.increments('gameID').notNullable().unique().primary();
    // table.string('word', 50).notNullable();
    table.boolean('complete').notNullable().defaultTo(false);
    table.integer('classID').references('Class.classID').notNullable();
    table.integer('scrumbleID').references('Scrumble.scrumbleID').notNullable();
    auditing(knex, table);
  });

  await knex.schema.createTable('Anagrams', (table: Knex.TableBuilder) => {
    table.increments('anagramID').notNullable().unique().primary();
    table.string('anagram').notNullable();
    table.boolean('selected').notNullable().defaultTo(false);
    table.integer('gameID').references('Game.gameID').notNullable();
    auditing(knex, table);
  });

  await knex.schema.createTable('Student', (table: Knex.TableBuilder) => {
    table.string('idNumber', 13).notNullable().unique().primary();
    table.string('firstName', 50).notNullable();
    table.string('lastName', 50).notNullable();
    table.string('contactNumber', 50).nullable();
    table.string('email', 50).nullable();
    table.string('roleType', 50).notNullable().defaultTo('STUDENT');
    table.string('password', 100).notNullable();
    table.boolean('active').notNullable().defaultTo(true);
    table.integer('schoolID').references('School.schoolID').notNullable();
    table.integer('classID').references('Class.classID').notNullable();
    auditing(knex, table);
  });

  await knex.schema.createTable('Leaderboard', (table: Knex.TableBuilder) => {
    table.increments('leaderboardID').notNullable().unique().primary();
    table.integer('score', 50).notNullable();
    table.string('idNumber').references('Student.idNumber').notNullable();
    auditing(knex, table);
  });

  await knex.schema.createTable('SchoolClassRoom', (table: Knex.TableBuilder) => {
    table.increments().unsigned().index().primary();
    table
      .integer('classID')
      .notNullable()
      .references('Class.classID')
      .notNullable();
    table
      .integer('schoolID')
      .notNullable()
      .references('School.schoolID')
      .notNullable();
    auditing(knex, table);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('Leaderboard')
    .dropTable('Student')
    .dropTable('Principal')
    .dropTable('Teacher')
    .dropTable('Admin')
    .dropTable('SchoolClassRoom')
    .dropTable('School')
    .dropTable('Anagrams')
    .dropTable('Game')
    .dropTable('Class')
    .dropTable('Scrumble')
}
