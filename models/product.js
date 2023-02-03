import { model, Schema } from "mongoose";

const ProductSchema = Schema({
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
    },
    price: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 0
    },
    //Setting the reference to the Category model
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String
    },
    available: {
        type: Boolean,
        default: true
    },
    image: {
        type: String
    }
});

ProductSchema.methods.toJSON = function() {
    const { __v, status, ...product } = this.toObject();
    return product;
}

export default model( 'Product', ProductSchema );