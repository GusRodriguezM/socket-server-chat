
import * as dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { existsSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';

import { request, response } from "express";

import cloudinary from 'cloudinary';

import { uploadFile } from "../helpers/index.js";
import { Product, User } from "../models/index.js";

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

//Controller to upload files to the server
export const uploadFiles = async( req = request, res = response) => {

    /**
     * Function to upload files. Receives three args
     * 1. The files from the request
     * 2. The specified extensions, if empty or undefined the function will accept only images
     * 3. The folder name to upload the files
     */

    try {
        //Example using different arguments
        // const fileName = await uploadFile( req.files, ['txt', 'md'], 'texts' );
        //Accepting only images
        const fileName = await uploadFile( req.files, undefined, 'imgs' );
        res.json({ fileName });
    } catch ( error ) {
        res.status(400).json({ msg: error });
    }
    
}

//Controller to update the image of the products or the users
export const updateImageCloudinary = async( req = request, res = response ) => {

    const { id, collection } = req.params;

    let model;

    /**
     * Switch to control the option (collection)
     * First we search an user or a product by the id, if exists we save the result in a variable otherwise we return an error
     */
    switch ( collection ) {
        case 'users':
            model = await User.findById( id );
            if( !model ){
                return res.status(400).json({ msg: `Does not exist a user with the id ${id}` });
            }

            break;
        
        case 'products':
            model = await Product.findById( id );
            if( !model ){
                return res.status(400).json({ msg: `There is no a product with the id ${id}`});
            }
            break;
    
        default:
            res.status(500).json({ msg: 'Option not valid' });
            break;
    }

    //Delete previous images
    if( model.image ){
        //Getting the id of the image from the url of cloudinary
        const imageArr = model.image.split('/');
        const imageName = imageArr[ imageArr.length - 1 ];
        const [ public_id ] = imageName.split('.');

        //Sending the reference to cloudinary, including the name of the folder
        cloudinary.uploader.destroy(`rest-server/${collection}/${public_id}`);
    }


    //Getting the temp file path from the request
    const { tempFilePath } = req.files.file;
    //Uploading the image to cloudinary in the folder of the collection
    const resp = await cloudinary.v2.uploader.upload( tempFilePath, { folder: `rest-server/${collection}` } );

    //Saving the name of the image in te database
    model.image = resp.secure_url;
    await model.save();

    //Finally we return the updated model (user or product)
    res.json( model );

}

//Controller to update the image of the products or the users
export const updateImage = async( req = request, res = response ) => {

    const { id, collection } = req.params;

    let model;

    /**
     * Switch to control the option (collection)
     * First we search an user or a product by the id, if exists we save the result in a variable otherwise we return an error
     */
    switch ( collection ) {
        case 'users':
            model = await User.findById( id );
            if( !model ){
                return res.status(400).json({ msg: `Does not exist a user with the id ${id}` });
            }

            break;
        
        case 'products':
            model = await Product.findById( id );
            if( !model ){
                return res.status(400).json({ msg: `There is no a product with the id ${id}`});
            }
            break;
    
        default:
            res.status(500).json({ msg: 'Option not valid' });
            break;
    }

    //Delete previous images
    if( model.image ){
        //We get the path of the image in the server depending on the collection
        const imagePath = path.join( __dirname, '../uploads', collection, model.image );

        //If the image exists then we delete it
        if( existsSync( imagePath ) ){
            unlinkSync( imagePath );
        }
    }

    //Uploading the image from the request in the folder specified by the name of the collection
    const fileName = await uploadFile( req.files, undefined, collection );

    //Saving the name of the image in te database
    model.image = fileName;

    await model.save();

    //Finally we return the updated model (user or product)
    res.json( model );

}

//Controller to show a default image in case where a user or a product does not have one
export const showImage = async( req = request, res = response ) => {

    const { id, collection } = req.params;

    let model;

    /**
     * Switch to control the option (collection)
     * First we search an user or a product by the id, if exists we save the result in a variable otherwise we return an error
     */
    switch ( collection ) {
        case 'users':
            model = await User.findById( id );
            if( !model ){
                return res.status(400).json({ msg: `Does not exist a user with the id ${id}` });
            }

            break;
        
        case 'products':
            model = await Product.findById( id );
            if( !model ){
                return res.status(400).json({ msg: `There is no a product with the id ${id}`});
            }
            break;
    
        default:
            res.status(500).json({ msg: 'Option not valid' });
            break;
    }

    if( model.image ){
        //We get the path of the image in the server depending on the collection if exists
        const imagePath = path.join( __dirname, '../uploads', collection, model.image );

        //If the image exists then we send it in the response
        if( existsSync( imagePath ) ){
            return res.sendFile( imagePath );
        }
    }

    //Uncomment the lines below to get the image from the database and redirect them to the specific url of cloudinary
    // if( model.image ){
    //     return res.redirect( model.image );
    // }

    //Getting the path of the default image
    const defaultImage = path.join( __dirname, '../assets/no-image.jpg' );

    //We send a default image when the product or user we look for does not have one
    res.sendFile( defaultImage );

}