import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
    email:
    {
        type: String,
        required: true
    },
    password: 
    {
        type: String,
        required: true
    },
    profile_image:{
        type: String,
        required: true
    }
}, { timestamps: true });

const UserModel = mongoose.model('user', userSchema);
export default UserModel;

