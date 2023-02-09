//URLs for development and production environments
const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://url-production' //TODO: Change this url for a valid one of production


let user = null;
let socket = null;

//HTML References
const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');
const btnLogout = document.querySelector('#btnLogout');

//Validate the token from the localStorage
const validateJWT = async() => {
    //Getting the socket from the localStorage
    const token = localStorage.getItem('token');

    //Redirect to the index page if the token is invalid
    if( token.length <= 10 ){
        window.location = 'index.html';
        throw new Error('There is no token in the server');
    }

    //Sending the token the renew it
    const resp = await fetch( url, {
        headers: { 'x-token': token }
    });

    const { user: userDB, token: tokenDB } = await resp.json();
    //Saving the new token in the localStorage
    localStorage.setItem( 'token', tokenDB );
    user = userDB;

    document.title = user.name;

    await connectSocket();
}

//Initialize the connection
const connectSocket = async() => {
    
    // Client socket connection
    //With this extra headers we can sent data through the connectiong between the client and the server
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem( 'token' )
        }
    });

    //Events
    //Socket when the client is connected
    socket.on( 'connect', () => {
        console.log('Socket online');
    });

    //Socket when the user is disconnected
    socket.on( 'disconnect', () => {
        console.log('Socket offline');
    });

    //Socket to listen the messages to receive
    socket.on( 'receive-messages', messagesList );

    //Socket to receive the list of active users
    socket.on( 'active-users', usersList );

    //Socket to receive private messages
    socket.on( 'private-message', () => {

    });

}

//Function to set the html for the list of active users
const usersList = ( users = [] ) => {

    let usersHtml = '';
    users.forEach( ({ name, uid }) => {

        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${name} </h5>
                    <span class="fs-6 text-muted"> ${uid} </span>
                </p>
            </li>
        `;
    });

    ulUsers.innerHTML = usersHtml;

}

//Function to set in the html the list of messages
const messagesList = ( messages = [] ) => {

    let messagesHtml = '';
    messages.forEach( ({ name, message }) => {

        messagesHtml += `
            <li>
                <p>
                    <span class="text-primary"> ${name} </span>
                    <span> ${message} </span>
                </p>
            </li>
        `;
    });

    ulMessages.innerHTML = messagesHtml;

}

//Adding an event listener to the input for the message
txtMessage.addEventListener( 'keyup', ({ keyCode}) => {
    const message = txtMessage.value;
    const uid = txtUid.value;

    if( keyCode !== 13 ) return; 
    if( message.length === 0 ) return;
    
    //Emit a message with the value and the uid
    socket.emit( 'send-message', { message, uid } );
    
});

const main = async() => {

    await validateJWT();

}

main();
