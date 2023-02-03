import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload'
import { dbConnection } from '../database/config.js';
import { authRouter } from '../routes/auth.js';
import { categoriesRouter } from '../routes/categories.js';
import { router } from '../routes/users.js';
import { productsRouter } from '../routes/products.js';
import { searchRouter } from '../routes/search.js';
import { uploadFilesRouter } from '../routes/uploads.js';

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            authPath: '/api/auth',
            categoriesPath: '/api/categories',
            productsPath: '/api/products',
            searchPath: '/api/search',
            uploadFilesPath: '/api/uploads',
            usersPath: '/api/users'
        }

        //Connection to th DB
        this.connectionToDB();

        //Middlewares
        this.middlewares();

        //App routes
        this.routes();
    }

    async connectionToDB() {
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use( cors() );

        //Reading and parsing the body
        this.app.use( express.json() );

        //Public folder
        this.app.use( express.static('public') );

        //File upload
        this.app.use( fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    //App routes
    routes() {
        this.app.use( this.paths.authPath, authRouter );
        this.app.use( this.paths.categoriesPath, categoriesRouter );
        this.app.use( this.paths.productsPath, productsRouter );
        this.app.use( this.paths.searchPath, searchRouter );
        this.app.use( this.paths.uploadFilesPath, uploadFilesRouter );
        this.app.use( this.paths.usersPath, router );
    }

    //Port where the app will run
    listen() {
        this.app.listen(this.port, () => {
            console.log(`The server is up and listening on port, ${this.port}`);
        });
    }

}

export default Server;