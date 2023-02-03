import { Router } from "express";
import { body, param } from 'express-validator';

import { validateFields, validateJWT, isAdminRole, hasRole } from '../middlewares/index.js';

import { isValidEmail, isValidRole, userByIdExists  } from "../helpers/db-validators.js";
import { search } from "../controllers/search.js";

export const searchRouter = Router();

//GET API Route
searchRouter.get( '/:collection/:searchTerm', search );