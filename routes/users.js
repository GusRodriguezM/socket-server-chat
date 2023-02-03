import { Router } from "express";
import { body, param } from 'express-validator';

import { usersDelete, usersGet, usersPatch, usersPost, usersPut } from "../controllers/users.js";

import { validateFields, validateJWT, isAdminRole, hasRole } from '../middlewares/index.js';

import { isValidEmail, isValidRole, userByIdExists  } from "../helpers/db-validators.js";

export const router = Router();

//GET API Route
router.get( '/', usersGet );

//POST API Route
router.post( '/', [
    body( 'name', 'The name is required' ).not().isEmpty(),
    body( 'email', 'The email is not valid' ).isEmail(),
    body( 'email' ).custom( isValidEmail ),
    body( 'password', 'The password should be at least 6 characters long').isLength({ min: 6 }),
    body( 'role' ).custom( isValidRole ),
    validateFields
], usersPost );

//PUT API Route
router.put( '/:id', [
    param( 'id' ).custom( userByIdExists ),
    body( 'role' ).custom( isValidRole ),
    validateFields
], usersPut );

//DELETE API Route
router.delete( '/:id', [
    validateJWT,
    //This middleware checks that only the users with an ADMIN role can perform this action
    isAdminRole,
    // hasRole( 'ADMIN_ROLE', 'VENTAS_ROLE', 'SUPER_ROLE' ),
    param( 'id' ).custom( userByIdExists ),
    validateFields
], usersDelete );

//DELETE 2 API Route
router.patch( '/', usersPatch );