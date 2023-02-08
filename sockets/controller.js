import { Socket } from "socket.io";
import { checkJWT } from "../helpers/index.js";

//Controller for the connections
export const socketController = async( socket = new Socket() ) => {
    
    //Waiting for the response from the function to check the token
    const user = await checkJWT( socket.handshake.headers['x-token'] );

    //If there is no authenticated user we disconnect the socket
    if( !user ){
        return socket.disconnect();
    }

    console.log(`${user.name} is connected`);

}