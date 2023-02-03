import * as dotenv from 'dotenv'
import Server from './models/server.js';
dotenv.config();

//Instance of the class server
const server = new Server();

server.listen();