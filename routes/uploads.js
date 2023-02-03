import { Router } from "express";
import { body, param } from 'express-validator';
import { showImage, updateImageCloudinary, uploadFiles } from "../controllers/uploads.js";
import { allowedCollections } from "../helpers/index.js";
import { validateFields, validateFileToUpload } from "../middlewares/index.js";

export const uploadFilesRouter = Router();

//GET API Route to upload a file
uploadFilesRouter.post( '/', validateFileToUpload, uploadFiles );

//PUT API Route to change the image of the user
uploadFilesRouter.put('/:collection/:id', [
    validateFileToUpload,
    param( 'id', 'The id is not valid' ).isMongoId(),
    //Using a callback to receive the collection and the list of allowed collections
    param( 'collection' ).custom( c => allowedCollections( c, ['users', 'products'] ) ),
    validateFields
], updateImageCloudinary );
// Uncomment the line below to use the update of the image locally (in the same server)
// ], updateImage );

//GET API Route to get the image of the user or product
uploadFilesRouter.get( '/:collection/:id', [
    param( 'id', 'The id is not valid' ).isMongoId(),
    param( 'collection' ).custom( c => allowedCollections( c, ['users', 'products'] ) ),
    validateFields
], showImage );