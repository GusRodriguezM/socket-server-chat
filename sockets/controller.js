import { Socket } from "socket.io";
import { checkJWT } from "../helpers/index.js";
import { ChatMessages } from "../models/index.js";

const chatMessages = new ChatMessages();

//Controller for the connections
export const socketController = async( socket = new Socket(), io ) => {
    
    //Waiting for the response from the function to check the token
    const user = await checkJWT( socket.handshake.headers['x-token'] );

    //If there is no authenticated user we disconnect the socket
    if( !user ){
        return socket.disconnect();
    }

    //Add the connected user
    chatMessages.connectUser( user );
    //Sending the active users through the socket
    io.emit( 'active-users', chatMessages.activeUsers );


    //Clean the list of active users when someone disconnects
    socket.on( 'disconnect', () => {
        //Remove the user from the list
        chatMessages.disconnectUser( user.id );
        //Emit the updated list with the current active users
        io.emit( 'active-users', chatMessages.activeUsers );
    });

    console.log(`${user.name} is connected`);

}