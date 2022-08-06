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

// const server = http.createServer(app);

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// routes
require('./src/routes')(app);

app.get('/', (req, res) => res.send('Hello World'));

app.listen(port, () => {
  Logger.log(`${serviceName} listening on port ${port}!`);
  startGame();
});
