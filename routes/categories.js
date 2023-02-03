import { Router } from "express";
import { body, param } from "express-validator";
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../controllers/categories.js";
import { existCategory } from "../helpers/db-validators.js";
import { isAdminRole, validateFields, validateJWT } from "../middlewares/index.js";

export const categoriesRouter = Router();

//Get all the categories - public
categoriesRouter.get( '/', getCategories );

//Get a category by id - public
categoriesRouter.get( '/:id', [
    param( 'id' ).custom( existCategory ),
    validateFields
], getCategoryById );

//Create a category - private with any role
categoriesRouter.post( '/', [
    validateJWT,
    body( 'name', 'The name of the category is required' ).not().isEmpty(),
    validateFields
], createCategory );

//Update a category by id - private anyone with a valid token
categoriesRouter.put( '/:id', [
    validateJWT,
    param( 'id' ).custom( existCategory ),
    body( 'name', 'The name is required' ).not().isEmpty(),
    validateFields
], updateCategory );

//Delete a category by id - private, only the users with the ADMIN role
categoriesRouter.delete( '/:id', [
    validateJWT,
    isAdminRole,
    param( 'id' ).custom( existCategory ),
    validateFields
], deleteCategory);