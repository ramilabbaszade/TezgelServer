import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const newSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    state: {
        type: String,
        enum: ['publish', 'inactive', 'trash'],
        default: 'publish'
    },
    photoUrl: String
}, { timestamps: true });


const New = model('New', newSchema);


export default New;