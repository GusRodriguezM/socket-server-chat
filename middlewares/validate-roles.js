import { request, response } from "express";

//Checks if the user has an ADMIN role
export const isAdminRole = ( req = request, res = response, next ) => {

    if( !req.user ){
        return res.status(500).json({
            msg: 'This action can not be performed because it needs to verify the token first'
        });
    }
    
    const { role, name } = req.user;

    if( role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${name} does not have enough permissions to perform this action`
        });
    }

    next();

}

//Receives the args (roles) and returns a function to be executed in the DELETE route
//Checks if the role of the authenticated user matches one of the sent roles as an argument
export const hasRole = ( ...roles ) => {

    return ( req = request, res = response, next ) => {

        if( !req.user ){
            return res.status(500).json({
                msg: 'This action can not be performed because it needs to verify the token first'
            });
        }

        if( !roles.includes( req.user.role ) ){
            return res.status(401).json({
                msg: `This service requires one of these roles: ${roles}`
            });
        }
        
        next();
    }

}