import { request, response } from "express";
import User from "../models/user.js";
import bcrypt from 'bcryptjs';
import { generateJWT } from "../helpers/generate-jwt.js";
import { googleVerify } from "../helpers/google-verify.js";

//Controller to do a login
export const login = async( req = request, res = response) => {

    const { email, password } = req.body;

    try {
        
        //Check if the email exists
        const user = await User.findOne( { email } );

        if( !user ){
            return res.status(400).json({
                msg: 'Email / Password are incorrect - email'
            });
        }

        //Check if the user is active
        if( !user.status ){
            return res.status(400).json({
                msg: 'Email / Password are incorrect - status: false'
            });
        }

        //Check the password
        const validPassword = bcrypt.compareSync( password, user.password );
        if( !validPassword ){
            return res.status(400).json({
                msg: 'Email / Password are incorrect - password'
            });
        }


        //Generate a JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });


    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            msg: 'Something went wrong!'
        });

    }

}

//Controller to do a google sign in
export const googleSignIn = async( req = request, res = response ) => {

    const { id_token } = req.body;

    try {

        const { name, email, image } = await googleVerify( id_token );

        let user = await User.findOne({ email });

        //Create the user if does not exist
        if( !user ){
            const data = {
                name,
                email,
                password: 'qwert',
                image,
                google: true
            };

            user = new User( data );
            await user.save();
        }

        //If the status of the user in the DB then negate the access
        if( !user.status ){
            return res.status(401).json({
                msg: 'Please talk with the admin. User is blocked!'
            });
        }

        //Generate the JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });
        
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'The token could not be verified'
        });
    }
    
}

//Controller to renew a token for the user
export const renewToken = async( req = request, res = response ) => {

    const { user } = req;

    //Generate a JWT
    const token = await generateJWT( user.id );

    res.json({ user, token });

}