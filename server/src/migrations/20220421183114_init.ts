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
    table.integer('grade').notNullable();
    table.integer('wordLen').notNullable();
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

  await knex.schema.createTable('SchoolClass', (table: Knex.TableBuilder) => {
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
    .dropTable('Student')
    .dropTable('Principal')
    .dropTable('Teacher')
    .dropTable('Admin')
    .dropTable('SchoolClass')
    .dropTable('School')
    .dropTable('Class');
}
