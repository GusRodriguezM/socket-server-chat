import { request, response } from "express";
import bcrypt from 'bcryptjs';

import User from '../models/user.js';

//GET API controller
export const usersGet = async(req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [ total, users ] = await Promise.all([
        User.countDocuments( query ),
        User.find( query )
            //To specify the number of registers to get
            .skip( Number( from ) )
            //Limit of registers to get from the DB
            .limit( Number( limit ) )
    ]);

    res.json({
        total,
        users
    });
}

//POST API controller
export const usersPost = async(req = request, res = response) => {

    const { name, email, password, role } = req.body;

    //Creating an instance of User
    const user = new User({ name, email, password, role });

    //Encrypt the password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync( password, salt );

    //Saving the user into the DB
    await user.save();

    res.json( user );
}

//PUT API controller
export const usersPut = async(req = request, res = response) => {

    const { id } = req.params;

    const { _id, password, google, email, ...rest } = req.body;

    if( password ){
        //Encrypt the password
        const salt = bcrypt.genSaltSync();
        rest.password = bcrypt.hashSync( password, salt );
    }

    const user = await User.findByIdAndUpdate( id, rest );
    
    res.json({
        msg: 'PUT request - controller',
        user
    });
}

//DELETE API controller
export const usersDelete = async(req = request, res = response) => {

    const { id } = req.params;
    const user = await User.findByIdAndUpdate( id, { status: false } );

    res.json( user );
}

//PATCH API controller
export const usersPatch = (req, res = response) => {
    res.json({
        msg: 'PATCH request - controller'
    });
}