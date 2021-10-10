import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const productSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    sort: Number,
    salePrice: {
        type: Number,
        required: true
    },
    shortDescription: String,
    description: String,
    images: [
        {
            imageUri: String
        }
    ],
    _category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
    }
}, { timestamps: true });

const Product = model('Product', productSchema);

export default Product;
