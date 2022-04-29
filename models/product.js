import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const productSchema = new Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    shortName: {
        type: String,
        required: true,
    },
    shortDescription: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        enum: ['publish', 'trash', 'inactive'],
        default: 'publish'
    },
    description: String,
    price: {
        required: true,
        type: Number
    },
    struckPrice: {
        type: Number
    },
    picUrls: [String],
    _categories: [{
        type: Schema.Types.ObjectId,
        ref: "Category",
    }],
    _subCategories: [{
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
    }],
    bundleItems: [
        new Schema({
            count: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true,
            },
            shortDescription: {
                type: String,
                required: true,
            },
            picUrl: {
                type: String,
                required: true
            }
        })
    ]
}, { timestamps: true });


const Product = model('Product', productSchema);

export default Product;