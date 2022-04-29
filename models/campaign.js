import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const campaignSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    url: String,
    state: {
        type: String,
        enum: ['publish', 'inactive', 'trash'],
        default: 'publish'
    },
    photoUrl: String
}, { timestamps: true });


const Campaign = model('Campaign', campaignSchema);


export default Campaign;