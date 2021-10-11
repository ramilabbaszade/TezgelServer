import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const offerSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    sort: Number,
    shortDescription: String,
    description: String,
    images: [
        {
            imageUri: String
        }
    ]
}, { timestamps: true });

const Offer = model('Offer', offerSchema);

export default Offer;
