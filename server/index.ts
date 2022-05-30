import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
// import { Server } from 'socket.io';

import { API } from './src/globals';
import { Logger } from './src/utils/logger';
import { DB } from './src/globals';
import { startGame } from './src/controllers/game';

// The name of your app/service
const serviceName = 'Esmart';

// The port which it should listen on
const port = API.PORT;

const app = express();

const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: `http://localhost:${port}`,
//     methods: ['GET', 'POST'],
//   },
// });

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

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

// io.on('connection', async(socket) => {
//   console.log('user connected ', socket.id);

//   socket.on('chat message', (msg) => {
//     console.log('msg ', msg);
//     io.emit('chat message', msg);
//   });

//   io.on('disconnect', () => {
//     console.log('user disconnected ', socket.id);
//   });
// });

server.listen(port, () => {
  Logger.log(`${serviceName} listening on port ${port}!`);
  startGame();
});
