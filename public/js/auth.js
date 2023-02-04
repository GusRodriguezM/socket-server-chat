//HTML References
const myForm = document.querySelector('form');

const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://url-production' //TODO: Change this url for a valid one of production


//Adding a listener to the form to get the value from the inputs
myForm.addEventListener( 'submit', e => {
    e.preventDefault();
    const formData = {};

    for( let element of myForm.elements ){
        if( element.name.length > 0 ){
            formData[element.name] = element.value;
        }
    }

    //Sending a request to our API to the login
    fetch( url + 'login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( resp => resp.json() )
    .then( ({ msg, token }) => {
        if( msg ){
            return console.log( msg );
        }

        //Saving the token in the localStorage if there is no errors
        localStorage.setItem( 'token', token );
    })
    .catch( err => { console.log(err) } )
});

//Function to make a login with google
function handleCredentialResponse(response) {

    const body = { id_token: response.credential };

    fetch( url + 'google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( body )
    })
        .then( resp => resp.json() )
        .then( ({ token }) => {
            //Saving the token in the localStorage
            localStorage.setItem( 'token', token );
        } )
        .catch( console.warn );
}

//Listener to trigger the log out from google
const button = document.getElementById( 'google_signout' );
button.onclick = () => {
    console.log( google.accounts.id );
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke( localStorage.getItem( 'email' ), done => {
        localStorage.clear();
        location.reload();
    });
}