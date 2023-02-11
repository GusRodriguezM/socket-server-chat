
//Class to model the message
class Message {
    constructor( uid, name, message ) {
        this.uid = uid;
        this.name = name;
        this.message = message;
    }
}

//Class to model a private message
class PrivateMessage {
    constructor( uid, name, message, uidReceiver, receiverName ) {
        this.uid = uid;
        this.name = name;
        this.message = message;
        this.uidReceiver = uidReceiver;
        this.receiverName = receiverName;
    }
}

//Class to model the messages of the chat
class ChatMessages {
    
    constructor() {
        this.messages = [];
        this.privateMessages = [];
        this.users = {};
    }

    //Get the last ten messages
    get lastMessages() {
        this.messages = this.messages.splice(0, 10);
        return this.messages;
    }

    //Find specific messages that matches with the id
    myPrivateMessages( uid = '' ) {
        const messages = this.privateMessages;
        let personalMessages = messages.find( msgs => msgs.uidReceiver === uid );
        return personalMessages;
    }

    //Get the connected users
    get activeUsers() {
        return Object.values( this.users );
    }

    //Method to send a message
    sendMessage( uid, name, message ) {
        this.messages.unshift( new Message( uid, name, message) );
    }

    //Method to send a private message
    sendPrivateMessage( uid, name, message, uidReceiver, receiverName ) {
        this.privateMessages.unshift( new PrivateMessage( uid, name, message, uidReceiver, receiverName ) );
    }

    //Add the user to the list
    connectUser( user ) {
        this.users[ user.id ] = user;
    }

    //Method to remove an user from the list (when disconnects)
    disconnectUser( id ) {
        delete this.users[ id ];
    }

}

export default ChatMessages;