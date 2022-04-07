import Category from '../models/category.js';
import Product from '../models/product.js';


export const getProducts = async (req, res, next) => {
    try {
        const { categorySlug } = req.query

        const category = await Category.findOne({slug: categorySlug});
        const products = await Product.find({_categories: category._id, status: 'publish'});

        return res.json({status: 'success', products, category})
    } catch (error) {
        next(error)
    }
}
