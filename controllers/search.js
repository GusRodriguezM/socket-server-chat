import { request, response } from "express";
import { Types } from "mongoose";
import { Category, Product, User } from "../models/index.js";

//The name of the collections in the DB
const collections = [
    'categories',
    'products',
    'roles',
    'users'
];

//Main function for all the searches
export const search = ( req = request, res = response) => {

    const { collection, searchTerm } = req.params;

    //If the collection from the params does not matches with any of the array we return an error
    if( !collections.includes( collection ) ){
        return res.status(400).json({
            msg: `The allowed collections are: ${collections}`
        });
    }

    switch ( collection ) {

        case collections[0]:
            searchCategories( searchTerm, res );
            break;
        case collections[1]:
            searchProducts( searchTerm, res );
            break;
        case collections[3]:
            searchUsers( searchTerm, res );
            break;
    
        default:
            res.status(500).json({
                msg: 'NOT ALLOWED!',
            });
            break;
    }

    

}

//Function to search the users by the id, name or email
const searchUsers = async( searchTerm = '', res = response) => {

    //Checking if the searchTerm is a valid mongo id
    const { ObjectId } = Types;
    const isMongoId = ObjectId.isValid( searchTerm );

    //If it's a mongo id then we search a user by the id
    if( isMongoId ){
        const user = await User.findById( searchTerm );

        //Return a user if exists or else an empty array
        return res.json({
            results: ( user ) ? [ user ] : []
        });
    }

    //Regular expression for avoid the case sensitive comparison betwen the search term and the name of the user
    const regexp = new RegExp( searchTerm, 'i' );

    //Filling the objects with the regular expression
    const name = { name: regexp };
    const email = { email: regexp };
    const query = { status: true };

    //Waiting for the response of both promises
    const [ total, users ] = await Promise.all([
        //Counting the results based on the name or the email and with the status equals true
        User.countDocuments({
            $or: [ name, email ],
            $and: [ query ]
        }),
        //Searching for a user based on the name or the email and with the status equals true
        User.find({
            $or: [ name, email ],
            $and: [ query ]
        })
    ]);

    //Returns an array of users that matches with the search term
    res.json({
        total,
        results: users
    });
}

//Function to search a category by the name or the id
const searchCategories = async( searchTerm = '', res = response ) => {

    const { ObjectId } = Types;
    const isMongoId = ObjectId.isValid( searchTerm );

    if( isMongoId ){
        const category = await Category.findById( searchTerm );

        return res.json({
            results: ( category ) ? [ category ] : []
        });
    }

    const regexp = new RegExp( searchTerm, 'i' );

    const name = regexp;
    const status = true;

    //Waiting for the response of both promises
    const [ total, categories ] = await Promise.all([
        //Counting the results based on the name and the status equals true
        Category.countDocuments( { name, status } ),
        Category.find( { name, status } )
    ]);

    //Returns an array of categories that matches with the search term and the total of results
    res.json({
        total,
        results: categories
    });

}

//Function to search products by the name or the id
const searchProducts = async( searchTerm = '', res = response) => {

    const { ObjectId } = Types;
    const isMongoId = ObjectId.isValid( searchTerm );

    if( isMongoId ){
        const product = await Product.findById( searchTerm ).populate( 'category', 'name' );

        return res.json({
            results: ( product ) ? [ product ] : []
        });
    }

    const regexp = new RegExp( searchTerm, 'i' );

    const name = regexp;
    const status = true;

    //Waiting for the response of both promises
    const [ total, products ] = await Promise.all([
        //Counting the results based on the name and the status equals true. We also see their respective category
        Product.countDocuments( { name, status } ),
        Product.find( { name, status } ).populate( 'category', 'name' )
    ]);

    //Returns an array of products that matches with the search term and the total of results
    res.json({
        total,
        results: products
    });


}