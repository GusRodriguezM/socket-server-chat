import jwt from 'jsonwebtoken';
import { User } from '../models/index.js'

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

//Function to check the token and get the user
export const checkJWT = async( token = '' ) => {

    try {

        //If the token is not valid exit the function
        if( token.length <= 10 ){
            return null;
        }

        //Getting the uid of the user 
        const { uid } = jwt.verify( token, process.env.SECRET_OR_PRIVATE_KEY );
        //Searching an user by the id
        const user = await User.findById( uid );

        //If the user exists then we ask for its status
        if( user ){
            //If the status is true return the user else return null
            if( user.status ){
                return user;
            }else{
                return null;
            }
        }else{
            return null;
        }
        
    } catch (error) {
        return null;
    }

}