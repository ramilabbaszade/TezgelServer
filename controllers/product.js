import { MongooseQueryParser } from 'mongoose-query-parser';
import Category from '../models/category.js';
import Product from '../models/product.js';

const parser = new MongooseQueryParser();

export const getProducts = async (req, res, next) => {
    try {
        
        const { categorySlug, subCategorySlug } = req.query

        const category = await Category.findOne({slug: categorySlug});
        const products = await Product.find({_categories: category._id});

        return res.json({status: 'success', products, category})
    } catch (error) {
        next(error)
    }
}
