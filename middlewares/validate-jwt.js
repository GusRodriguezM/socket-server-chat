import { request, response } from "express";
import jwt from "jsonwebtoken";

import User from '../models/user.js';

export const validateJWT = async( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            msg: 'There is no token in the request'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRET_OR_PRIVATE_KEY );

        //Read from the DB the user that matches with the uid
        const user = await User.findById( uid );

        if( !user ){
            return res.status(401).json({
                msg: 'Invalid token - the user does not exist in the DB'
            });
        }

        //Check if the user with uid has true in the status (if it's active)
        if( !user.status ){
            return res.status(401).json({
                msg: 'Invalid token - user status: false'
            });
        }


        req.user = user;

        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Invalid token'
        });
    }

}