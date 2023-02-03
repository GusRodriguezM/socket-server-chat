import mongoose from 'mongoose';
import { Category, Product, Role, User } from '../models/index.js';

//Verify if the role sent by the user is a valid value compared to the DB
export const isValidRole = async( role = '') => {
    const roleExists = await Role.findOne({ role });
    if( !roleExists ){
        throw new Error(`The role ${role} does not exist in the database`);
    }
}

//Verify if the email exists and if its valid
export const isValidEmail = async( email = '' ) => {
    const emailExists = await User.findOne({ email });
    if( emailExists ){
        throw new Error(`The email: ${email} is already registered`);
    }
}

//Checks if an user exists by the id
export const userByIdExists = async( id ) => {

    if( mongoose.Types.ObjectId.isValid( id ) ){
        const userExists = await User.findById( id );

        if( !userExists ){
            throw new Error(`The id ${id} does not exist in the database`);
        }
    }else{
        throw new Error(`The id ${id} is not valid`);
    }

}

//Checks if the category exist (by the id) in the DB
export const existCategory = async( id ) => {

    if( mongoose.Types.ObjectId.isValid( id ) ){

        const categoryExist = await Category.findById( id );

        if( !categoryExist ){
            throw new Error(`The id ${id} does not exist in the database`);
        }

    }else{
        throw new Error(`The id ${id} is not valid`);
    }

}

//Checks if the product exist (by the id) in the DB
export const existProduct = async( id ) => {

    if( mongoose.Types.ObjectId.isValid( id ) ){

        const productExist = await Product.findById( id );

        if( !productExist ){
            throw new Error(`The id ${id} does not exist in the database`);
        }

    }else{
        throw new Error(`The id ${id} is not valid`);
    }

}

//Validate allowed collections
export const allowedCollections = ( collection = '', collections = [] ) => {

    const validCollection = collections.includes( collection );

    if( !validCollection ){
        throw new Error( `The collection ${collection} is not allowed. The allowed collections are ${collections}` );
    }

    return true;

}