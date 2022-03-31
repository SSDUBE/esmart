import mongoose from 'mongoose';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { API } from './src/globals';
import { Logger } from './src/utilities/logger';
import { DB } from './src/globals';


const app = express();

// The name of your app/service
const serviceName = 'School Dashboard';

// The port which it should listen on
const port = API.PORT;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// connect to mongoose
mongoose.connect(DB.DB_STRING, { autoIndex: false }).then(
  () => Logger.log('Successfully connected to DB'),
  (err) => {
    Logger.log('Mongoose connection error:', err);
    throw new Error(err);
  }
);

// app.use((req: any, res: Response, next: NextFunction) => {
//   const authHeader: string = req.headers.authorization!;

//   if (authHeader) {
//     const [, token] = authHeader.split(' ');
//     const decoded = jwt.decode(token);
//     try {
//       if (decoded) {
//         req.user = {
//           // @ts-ignore
//           id: decoded.id,
//           // @ts-ignore
//           id_number: decoded.id_number,
//         };
//       }
//       jwt.verify(token, secret);
//       console.log('running middleware ', decoded);
//       next();
//     } catch (err) {
//       return res
//         .status(HTTP_CODES.UNAUTHORIZED)
//         .send({ error: 'Token has an invalid subject' });
//     }
//     return createContext(req);
//   }
// });

// routes
require('./src/routes')(app);

app.get('/', (req, res) => res.send('Hello World'));

app.listen(port, () => Logger.log(`${serviceName} listening on port ${port}!`));
