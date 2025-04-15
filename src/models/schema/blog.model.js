import mongoose, { Schema } from 'mongoose';

export const blogSchema = new mongoose.Schema({
    title:
    {
        type: String,
        required: true
    },
    description: 
    {
        type: String,
        required: true
    },
    blog_image:
    {
        type: String,
        required: true
    },
    userId:
    {
        type:Schema.Types.ObjectId, ref: 'user'
    }
}, { timestamps: true });

const BlogModel = mongoose.model('blog', blogSchema);
export default BlogModel;

