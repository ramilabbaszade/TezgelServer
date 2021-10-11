import { MongooseQueryParser } from 'mongoose-query-parser';
import Category from '../models/category.js';
import Product from '../models/product.js';
import { NotAuthorized, BadRequest } from "../utils/errors.js";
import s3Uploader from '../utils/s3-uploader.js';

const parser = new MongooseQueryParser();

export const getProduct = async (req, res, next) => {
    try {
        return res.json({ data: await Product.findById(req.params._id) });
    } catch (err) {
        next(err)
    }
}

export const getProducts = async (req, res, next) => {
    const { filter, sort, limit, skip, select } = parser.parse(req.query)

    try {
        const products = await Product
            .find(filter)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .select(select)

        const count = await Product.countDocuments();

        return res.json({
            data: products,
            count,
            limit,
            skip
        });
    } catch (err) {
        next(err)
    }
}

export const createProduct = async (req, res, next) => {
    const {
        title,
        shortDescription,
        images,
        price,
        salePrice,
        description,
        _category
    } = req.body;
    try {
        const c = await Product.findOne({ title });

        if (c) throw new BadRequest('Product already created with title')

        const count = await Product.countDocuments();

        const product = await Product.create({
            title,
            shortDescription,
            price,
            description,
            salePrice,
            _category,
            sort: count + 1
        });

        await images.forEach(async (im, i) => {
            const imageUri = await s3Uploader(im.imageUri, `${title}-${i}.jpg`);
            product.images.push({imageUri})
            await product.save()
        })

        const category = await Category.findById(_category);

        category._products.push(product._id)

        await category.save();

        return res.status(200).json({ data: product, 
            msg: 'Product created.', 
         });
    } catch (err) {
        next(err)
    }
}

export const updateProducts = async (req, res, next) => {
    try {
        let products = [];
        let _category;
        req.body.data.forEach(async (c, i) => {
            const product = await Product.findById(c._id);
            product.sort = i + 1;
            await product.save();
            _category = product._category;
            products.push(product)
        })

        const category = await Category.findById(_category);

        category._products = products.map(p => p._id);

        await category.save();

        return res.status(200).json({
            msg: 'Products updated.', 
         });
    } catch (err) {
        next(err)
    }
}

export const updateProduct = async (req, res, next) => {
    const {
        title,
        shortDescription,
        images,
        price,
        salePrice,
        description,
        _category
    } = req.body;

    try {
        const product = await Product.findById(req.params._id);

        product.title = title;
        product.shortDescription = shortDescription;
        product.price = price;
        product.salePrice = salePrice;
        product.description = description;
        product._category = _category;

        await product.save()

        await images.forEach(async (im, i) => {
            const imageUri = !im._id 
                ? await s3Uploader(im.imageUri, `${title}-${i}.jpg`) 
                : im.imageUri;
            product.images.push({imageUri})
            await product.save()
        })

        return res.status(200).json({ data: product, msg: 'Product updated.' });
    } catch (err) {
        next(err);
    }
}

export const deleteProducts = async (req, res, next) => {
    try {
        req.body._ids.forEach(async _id => {
            await Product.findByIdAndRemove(_id);
        })
        return res.status(200).json({ msg: 'Products deleted.' });
    } catch (err) {
        next(err)
    }
}