import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const commentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    sort: Number,
    description: String
}, { timestamps: true });

const Comment = model('Comment', commentSchema);

export default Comment;
