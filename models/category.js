import { model, Schema } from "mongoose";

const CategorySchema = Schema({
    name: {
        type: String,
        required: [true, 'The name is required'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    //Setting the reference to the User model
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

});

CategorySchema.methods.toJSON = function() {
    const { __v, status, ...category } = this.toObject();
    return category;
}

export default model( 'Category', CategorySchema );