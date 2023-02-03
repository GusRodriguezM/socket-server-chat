import { Router } from "express";
import { body } from "express-validator";
import { googleSignIn, login } from "../controllers/auth.js";
import { validateFields } from "../middlewares/fields-validator.js";

export const authRouter = Router();

authRouter.post( '/login', [
    body( 'email', 'The email is not valid' ).isEmail(),
    body( 'password', 'The password is required').not().isEmpty(),
    validateFields
], login );

authRouter.post( '/google', [
    body( 'id_token', 'The google token must not be empty' ).not().isEmpty(),
    validateFields
], googleSignIn );