
//Class to model the message
class Message {
    constructor( uid, name, message ) {
        this.uid = uid;
        this.name = name;
        this.message = message;
    }
}

//Class to model the messages of the chat
class ChatMessages {
    
    constructor() {
        this.messages = [];
        this.users = {};
    }

    //Get the last ten messages
    get lastMessages() {
        this.messages = this.messages.splice(0, 10);
        return this.messages;
    }

    //Get the connected users
    get activeUsers() {
        return Object.values( this.users );
    }

    //Method to send a message
    sendMessage( uid, name, message ) {
        this.messages.unshift( new Message( uid, name, message) );
    }

    //Add the user to the list
    connectUser( user ) {
        this.users[ user.id ] = user;
    }

    //Method to remove an user from the list (when disconnects)
    disconnectUser( user ) {
        delete this.users[ user.id ];
    }

}

export default ChatMessages;