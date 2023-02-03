import { request, response } from "express";
import { Category } from '../models/index.js';

//GET API controller - gets all the categories
export const getCategories = async( req = request, res = response ) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    /**
     * Waits for the promises to be resolved and gets the total number of documents
     * Gets all the documents that has the status equals true
     */
    const [ total, categories ] = await Promise.all([
        Category.countDocuments( query ),
        Category.find( query )
            //populate returns the object referenced by its id
            .populate( 'user', 'name' )
            .skip( Number( from ) )
            .limit( Number( limit ) )
    ]);

    res.json({
        total,
        categories
    });

}

//GET API controller - get a category by its id
export const getCategoryById = async( req = request, res = response ) => {

    const { id } = req.params;

    const category = await Category.findById( id ).populate( 'user', 'name' );

    res.json( category );

}

//POST API Controller - creates a new category
export const createCategory = async( req = request, res = response ) => {

    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne( { name } );

    //Searches in the database for any other category with the same data
    if( categoryDB ){
        return res.status(400).json({
            msg: `The category ${categoryDB.name} already exists`
        });
    }

    //Prepare the data to save in the DB
    const data = {
        name,
        user: req.user._id
    }

    //Saving the data into the database
    const category = new Category( data );

    await category.save();

    res.status(201).json( category );

}

//Updates a category if exists
export const updateCategory = async( req = request, res = response ) => {

    const { id } = req.params;

    //Extracting the user and the status from the request, we left only the name of the category
    const { status, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    //Updating the category by sending the name and the user id, it returns the object updated
    const category = await Category.findByIdAndUpdate( id, data, { new: true } );

    res.json( category );

}

//Deletes a category by the id
export const deleteCategory = async( req = request, res = response ) => {

    const { id } = req.params;

    //The object with the new property makes that the function returns the updated mongo register
    const deletedCategory = await Category.findByIdAndUpdate( id, { status: false }, { new: true } );

    res.json( deletedCategory );

}