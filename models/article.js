import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const articleSchema = new Schema({
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

const Article = model('Article', articleSchema);

export default Article;
