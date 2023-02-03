import mongoose from 'mongoose';

export const dbConnection = async() => {

    try {
        
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DATABASE_CNN);

        console.log('The connection to the database has been successful');
    } catch (error) {
        console.log(error);
        throw new Error('Error in the database connection');
    }
}