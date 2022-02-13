import mongoose from 'mongoose';
import { productSchema } from './product.js'

const { Schema, model } = mongoose;

const subCategorySchema = new Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    productCount: Number,
    products: [productSchema]
}, { timestamps: true });

const categorySchema = new Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    productCount: Number,
    picUrl: String,
    subCategories: [subCategorySchema]
}, { timestamps: true });

const Category = model('Category', categorySchema);

export default Category;
