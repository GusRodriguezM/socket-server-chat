//URLs for development and production environments
const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://url-production' //TODO: Change this url for a valid one of production


let user = null;
let socket = null;

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
    const socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem( 'token' )
        }
    });

}

const main = async() => {

    await validateJWT();

}

main();
