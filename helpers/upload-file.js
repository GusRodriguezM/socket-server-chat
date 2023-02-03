import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );

//Allowed extensions by default
const defaultExtensions = [ 'png', 'jpg', 'jpeg', 'gif' ];

/**
 * Function to upload a file
 * 
 * @param { file } files file type from the request
 * @param { Array } validExtensions is an array that contains the allowed extensions
 * @param { String } folder string with the name where the files will be saved
 * @returns The name of the uploaded file (image, text, csv)
 */
export const uploadFile = ( files, validExtensions = defaultExtensions, folder = '' ) => {

    return new Promise( (resolve, reject) => {

        const { file } = files;

        //Splitting the file name into elemetens of an array
        const shortName = file.name.split('.');
        
        //Getting the extension of the file
        const extension = shortName[ shortName.length - 1 ];

        //Comparing the extension against an allowed list of extensions
        if( !validExtensions.includes( extension ) ){
            return reject( `The extension ${extension} is not allowed. The allowed extensions are ${validExtensions}` );
        }

        const tempName = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/', folder, tempName );

        file.mv( uploadPath, (err) => {
        
            if ( err ) {
                reject( err );
            }

            resolve( tempName );

        });

    });

}