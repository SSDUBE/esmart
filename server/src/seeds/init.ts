import { Knex } from 'knex';
import { PasswordBcrypt } from '../controllers/passwordBcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('Class').del();

  // Inserts seed entries
  await knex('Class').insert([
    { grade: 1, channel: 'gradeOne' },
    { grade: 2, channel: 'gradeTwo' },
    { grade: 3, channel: 'gradeThree' },
    { grade: 4, channel: 'gradeFour' },
    { grade: 5, channel: 'gradeFive' },
    { grade: 6, channel: 'gradeSix' },
    { grade: 7, channel: 'gradeSeven' },
    { grade: 8, channel: 'gradeEight' },
    { grade: 9, channel: 'gradeNine' },
    { grade: 10, channel: 'gradeTen' },
    { grade: 11, channel: 'gradeEleven' },
    { grade: 12, channel: 'gradeTwelve' },
  ]);

  await knex('Admin').insert([
    {
      idNumber: '9701014800084',
      firstName: 'admin',
      lastName: 'admin',
      contactNumber: '0796015904',
      email: 'admin@gmail.com',
      password: await PasswordBcrypt.encrypt('Admin@123'),
    },
  ]);

  await knex('Scrumble').insert([
    { word: 'aelst' },
    { word: 'aeprs' },
    { word: 'aelrst' },
    { word: 'abets' },
    { word: 'least' },
    { word: 'stake' },
    { word: 'pares' },
    // { word: '' },
    // { word: '' },
    // { word: '' },
    // { word: '' },
    // { word: '' },
    // { word: '' },
    // { word: '' },
    // { word: '' },
    // { word: '' },
    // { word: '' },
    // { word: '' },
    // { word: '' },
    // { word: '' },
  ]);
}
