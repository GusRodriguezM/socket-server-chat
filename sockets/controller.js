import { Socket } from "socket.io";
import { checkJWT } from "../helpers/index.js";
import { ChatMessages } from "../models/index.js";
import { User } from '../models/index.js';

//Instance of the class for the chat and the messages
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
    //Sending the last messages to the new connected user
    socket.emit( 'receive-messages', chatMessages.lastMessages );

    /**
     * Connect to a special chat room 
     * The users that connects now will have three chat rooms
     * 1. The global chat room
     * 2. By the socket id
     * 3. By the user id
     */
    socket.join( user.id );

    //Clean the list of active users when someone disconnects
    socket.on( 'disconnect', () => {
        //Remove the user from the list
        chatMessages.disconnectUser( user.id );
        //Emit the updated list with the current active users
        io.emit( 'active-users', chatMessages.activeUsers );
    });

    //Send a message to chat room
    socket.on( 'send-message', async({ uid, message }) => {

        //If the id is present then is a private message else is for the general chat room
        if( uid ){

            const { name: receiverName } = await User.findById( uid );

            chatMessages.sendPrivateMessage( user.id, user.name, message, uid, receiverName );
            //Send a message to a specific user
            // socket.to( uid ).emit( 'private-message', { from: user.name, message } );
            //Send the message to an user
            socket.to( uid ).emit( 'private-message', chatMessages.myPrivateMessages( uid ) );
            //Send it to all the clients in the chat room
            socket.emit( 'private-message', chatMessages.myPrivateMessages( uid ) );
        }else{
            //Preparing the message to send
            chatMessages.sendMessage( user.id, user.name, message );
            //Send the historic of the messages
            io.emit( 'receive-messages', chatMessages.lastMessages );
        }

    });

    console.log(`${user.name} is connected`);

}