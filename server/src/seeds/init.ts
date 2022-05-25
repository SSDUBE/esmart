import { Knex } from 'knex';
import { PasswordBcrypt } from '../controllers/passwordBcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('Class').del();

  // Inserts seed entries
  await knex('Class').insert([
    { grade: 1, wordLen: 5 },
    { grade: 2, wordLen: 5 },
    { grade: 3, wordLen: 5 },
    { grade: 4, wordLen: 5 },
    { grade: 5, wordLen: 5 },
    { grade: 6, wordLen: 5 },
    { grade: 7, wordLen: 5 },
    { grade: 8, wordLen: 5 },
    { grade: 9, wordLen: 5 },
    { grade: 10, wordLen: 5 },
    { grade: 11, wordLen: 5 },
    { grade: 12, wordLen: 5 },
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
