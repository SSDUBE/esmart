import { Knex } from 'knex';
import { auditing } from './utils/auditing';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('SCHOOL', (table: Knex.TableBuilder) => {
    table.increments('schoolID').notNullable().index().primary();
    table.string('schoolName', 50).notNullable();
    table.boolean('active').notNullable().defaultTo(true);
    table.timestamps(true, true);
    auditing(knex, table);
  });

  await knex.schema.createTable('PRINCIPAL', (table: Knex.TableBuilder) => {
    table.string('idNumber', 13).notNullable().unique().primary();
    table.string('firstName', 50).nullable();
    table.string('lastName', 50).nullable();
    table.string('contactNumber', 50).nullable();
    table.string('email', 50).notNullable();
    table.string('roleType', 50).notNullable().defaultTo('PRINCIPAL');
    table.string('password', 100).notNullable();
    table.boolean('active').notNullable().defaultTo(true);
    table.integer('schoolID').references('SCHOOL.schoolID').notNullable();
    auditing(knex, table);
  });

  await knex.schema.createTable('TEACHER', (table: Knex.TableBuilder) => {
    table.string('idNumber', 13).notNullable().unique().primary();
    table.string('firstName', 50).nullable();
    table.string('lastName', 50).nullable();
    table.string('contactNumber', 50).nullable();
    table.string('email', 50).nullable();
    table.string('roleType', 50).notNullable().defaultTo('TEACHER');
    table.string('password', 100).notNullable();
    table.boolean('active').notNullable().defaultTo(true);
    table.integer('schoolID').references('SCHOOL.schoolID').notNullable();
    auditing(knex, table);
  });

  await knex.schema.createTable('ADMIN', (table: Knex.TableBuilder) => {
    table.string('idNumber', 13).notNullable().unique().primary();
    table.string('firstName', 50).nullable();
    table.string('lastName', 50).nullable();
    table.string('contactNumber', 50).nullable();
    table.string('email', 50).nullable();
    table.string('roleType', 50).notNullable().defaultTo('ADMIN');
    table.string('password', 100).notNullable();
    table.boolean('active').notNullable().defaultTo(true);
    table.integer('schoolID').references('SCHOOL.schoolID').nullable();
    auditing(knex, table);
  });

  await knex.schema.createTable('CLASS', (table: Knex.TableBuilder) => {
    table.increments('classID').notNullable().unique().primary();
    table.string('channel').notNullable().unique();
    table.integer('grade').notNullable();
    auditing(knex, table);
  });

  await knex.schema.createTable('SCRUMBLE', (table: Knex.TableBuilder) => {
    table.increments('scrumbleID').notNullable().unique().primary();
    table.string('word', 50).notNullable();
    table.integer('wordLength').notNullable();
    auditing(knex, table);
  });

  await knex.schema.createTable('GAME', (table: Knex.TableBuilder) => {
    table.increments('gameID').notNullable().unique().primary();
    table.boolean('complete').notNullable().defaultTo(false);
    table.integer('classID').references('CLASS.classID').notNullable();
    table.integer('scrumbleID').references('SCRUMBLE.scrumbleID').notNullable();
    auditing(knex, table);
  });

  await knex.schema.createTable('ANAGRAMS', (table: Knex.TableBuilder) => {
    table.increments('anagramID').notNullable().unique().primary();
    table.string('anagram').notNullable();
    table.boolean('selected').notNullable().defaultTo(false);
    table.integer('gameID').references('GAME.gameID').notNullable();
    auditing(knex, table);
  });

  await knex.schema.createTable('STUDENT', (table: Knex.TableBuilder) => {
    table.string('idNumber', 13).notNullable().unique().primary();
    table.string('firstName', 50).notNullable();
    table.string('lastName', 50).notNullable();
    table.string('contactNumber', 50).nullable();
    table.string('email', 50).nullable();
    table.string('roleType', 50).notNullable().defaultTo('STUDENT');
    table.string('password', 100).notNullable();
    table.boolean('active').notNullable().defaultTo(true);
    table.integer('schoolID').references('SCHOOL.schoolID').notNullable();
    table.integer('classID').references('CLASS.classID').notNullable();
    table.boolean('suspended').defaultTo(false);
    table.date('suspendedDate');
    auditing(knex, table);
  });

  await knex.schema.createTable('LEADERBOARD', (table: Knex.TableBuilder) => {
    table.increments('leaderboardID').notNullable().unique().primary();
    table.integer('score', 50).notNullable();
    table.string('idNumber').references('STUDENT.idNumber').notNullable();
    auditing(knex, table);
  });

  await knex.schema.createTable(
    'SCHOOLCLASSROOM',
    (table: Knex.TableBuilder) => {
      table.increments('schoolClassRoomID').unsigned().index().primary();
      table
        .integer('classID')
        .notNullable()
        .references('CLASS.classID')
        .notNullable();
      table
        .integer('schoolID')
        .notNullable()
        .references('SCHOOL.schoolID')
        .notNullable();
      auditing(knex, table);
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('LEADERBOARD')
    .dropTable('STUDENT')
    .dropTable('PRINCIPAL')
    .dropTable('TEACHER')
    .dropTable('ADMIN')
    .dropTable('SCHOOLCLASSROOM')
    .dropTable('SCHOOL')
    .dropTable('ANAGRAMS')
    .dropTable('GAME')
    .dropTable('CLASS')
    .dropTable('SCRUMBLE');
}
