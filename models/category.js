import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const categorySchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    sort: Number,
    shortDescription: String,
    images: [
        {
            imageUri: String
        }
    ],
    _products: [{
        type: Schema.Types.ObjectId,
        ref: "Product",
    }]
}, { timestamps: true });

const Category = model('Category', categorySchema);

export default Category;
