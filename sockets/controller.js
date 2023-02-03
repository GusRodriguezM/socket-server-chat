import { Socket } from "socket.io";

export const socketController = ( socket = new Socket() ) => {
    console.log('Client connected', socket.id);
}