import mongoose from 'mongoose';

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
    // products: [{
    //     type: Schema.Types.ObjectId,
    //     ref: "Product",
    // }]
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
    picUrl: String,
    subCategories: [subCategorySchema]
}, { timestamps: true });

const Category = model('Category', categorySchema);

export default Category;
