import { Router } from "express";
import { body } from "express-validator";
import { googleSignIn, login, renewToken } from "../controllers/auth.js";
import { validateFields, validateJWT } from "../middlewares/index.js";

export const authRouter = Router();

//Route to login 
authRouter.post( '/login', [
    body( 'email', 'The email is not valid' ).isEmail(),
    body( 'password', 'The password is required').not().isEmpty(),
    validateFields
], login );

//Route to sign in with google
authRouter.post( '/google', [
    body( 'id_token', 'The google token must not be empty' ).not().isEmpty(),
    validateFields
], googleSignIn );

//Route to renew the token
authRouter.get( '/', validateJWT, renewToken );