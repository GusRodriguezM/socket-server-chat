import { request, response } from "express";

//Checks if the request contains a file to upload
export const validateFileToUpload = ( req = request, res = response, next ) => {

    if ( !req.files || Object.keys(req.files).length === 0 || !req.files.file ) {
        return res.status(400).json({
            msg: 'There is no files in the request to upload'
        });
    }

    next();

}