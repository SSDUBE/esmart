import { Knex } from 'knex';
import { PasswordBcrypt } from '../controllers/passwordBcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('CLASS').del();

  // Inserts seed entries
  await knex('CLASS').insert([
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

  await knex('ADMIN').insert([
    {
      idNumber: '9701014800084',
      firstName: 'Sindiso',
      lastName: 'Dube',
      contactNumber: '0796015904',
      email: 'admin@gmail.com',
      password: await PasswordBcrypt.encrypt('Admin@123'),
    },
    {
      idNumber: '9801014800082',
      firstName: 'Zanele',
      lastName: '',
      contactNumber: '0796015904',
      email: 'admin@gmail.com',
      password: await PasswordBcrypt.encrypt('Admin@123'),
    },
    {
      idNumber: '9806014800081',
      firstName: 'Lwando',
      lastName: 'Test',
      contactNumber: '0796015904',
      email: 'lwando@gmail.com',
      password: await PasswordBcrypt.encrypt('Admin@123'),
    },
    {
      idNumber: '9806114800080',
      firstName: 'Tebatso',
      lastName: 'Test1',
      contactNumber: '0796015904',
      email: 'tebatso@gmail.com',
      password: await PasswordBcrypt.encrypt('Admin@123'),
    },
    {
      idNumber: '9701014811084',
      firstName: 'Samnkelisiwe',
      lastName: 'Test2',
      contactNumber: '0796015904',
      email: 'sam@gmail.com',
      password: await PasswordBcrypt.encrypt('Admin@123'),
    },
    {
      idNumber: '9806204800181',
      firstName: 'Themba',
      lastName: 'knoza',
      contactNumber: '0796015904',
      email: 'khoza@gmail.com',
      password: await PasswordBcrypt.encrypt('Admin@123'),
    },
  ]);

  await knex('SCRUMBLE').insert([
    { word: 'aelst', wordLength: 5 },
    { word: 'aeprs', wordLength: 5 },
    { word: 'aelrst', wordLength: 5 },
    { word: 'abets', wordLength: 5 },
    { word: 'least', wordLength: 5 },
    { word: 'stake', wordLength: 5 },
    { word: 'pares', wordLength: 5 },
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
