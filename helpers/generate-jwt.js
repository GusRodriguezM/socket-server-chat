import jwt from 'jsonwebtoken';

//Function to generate a json web token
export const generateJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) => {

        //Receiving the user id as the payload
        const payload = { uid };

        //Sending the payload and the private key
        jwt.sign( payload, process.env.SECRET_OR_PRIVATE_KEY, {
            expiresIn: '8h'
        }, (err, token) => {
            
            if( err ){
                console.log(err);
                reject('The token could not be generated');
            }else{
                resolve( token );
            }
        });

    });
}