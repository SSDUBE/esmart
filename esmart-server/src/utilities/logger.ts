import moment from 'moment';

export class Logger {
  static log = (args1 = '', args2 = '') => {
    process.stdout.write(`[ ${moment().format('YYYY-MM-DD HH:mm:ss')} ]: `);

    if (args2) console.log(args1, args2);
    else console.log(args1);
  };

  static error = (args1 = '', args2 = '') => {
    process.stdout.write(`[ ${moment().format('YYYY-MM-DD HH:mm:ss')} ]: `);

    if (args2) console.error(args1, args2);
    else console.error(args1);
  };
}
