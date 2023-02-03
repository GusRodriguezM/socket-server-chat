import { model, Schema } from "mongoose";

const RoleSchema = Schema({
    role: {
        type: String,
        required: [true, 'The role is required']
    }
});

export default model( 'Role', RoleSchema );