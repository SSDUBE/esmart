import { Knex } from 'knex';
import { PasswordBcrypt } from '../controllers/passwordBcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('Class').del();

  // Inserts seed entries
  await knex('Class').insert([
    { grade: 1, wordLen: 5, channel: 'gradeOne' },
    { grade: 2, wordLen: 5, channel: 'gradeTwo' },
    { grade: 3, wordLen: 5, channel: 'gradeThree' },
    { grade: 4, wordLen: 5, channel: 'gradeFour' },
    { grade: 5, wordLen: 5, channel: 'gradeFive' },
    { grade: 6, wordLen: 5, channel: 'gradeSix' },
    { grade: 7, wordLen: 5, channel: 'gradeSeven' },
    { grade: 8, wordLen: 5, channel: 'gradeEight' },
    { grade: 9, wordLen: 5, channel: 'gradeNine' },
    { grade: 10, wordLen: 5, channel: 'gradeTen' },
    { grade: 11, wordLen: 5, channel: 'gradeEleven' },
    { grade: 12, wordLen: 5, channel: 'gradeTwelve' },
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
}
