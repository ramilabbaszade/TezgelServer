import { MongooseQueryParser } from 'mongoose-query-parser';
import Category from '../models/category.js';
import { NotAuthorized, BadRequest } from "../utils/errors.js";
import { makePinCode } from '../utils/helpers.js';
import s3Uploader from '../utils/s3-uploader.js';
import { default as nodeFetch } from 'node-fetch';

const parser = new MongooseQueryParser();

export const getCategory = async (req, res, next) => {
    try {
        return Category.findOne();
        const a = await nodeFetch('https://getirx-client-api-gateway.getirapi.com/category/products?countryCode=TR&categorySlug=indirimler-FED6IOddNy', { method: 'GET', headers: {'x-language': 'tr'}})
        const {data} = await a.json();
        const {category} = data;
        console.log(category.id);
        const c = await Category.create({
            slug: category.slug,
            name: category.name,
            picUrl: category.picURL,
            productCount: category.productCount
        });

        await c.save()

        return c;
        
        // return res.json({ data: await Category.findById(req.params._id) });
    } catch (err) {
        next(err)
    }
}

export const getCategories = async (req, res, next) => {
    const { filter, sort, limit, skip, select } = parser.parse(req.query)

    try {
        const categories = await Category
            .find(filter)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .select(select)
            .populate('sub')

        const count = await Category.countDocuments();

        return res.json({
            data: categories,
            count,
            limit,
            skip
        });
    } catch (err) {
        next(err)
    }
}

export const createCategory = async (req, res, next) => {
    const {
        slug,
        name,
        picUrl
    } = req.body;
    try {
        const category = await Category.create({
            slug,
            name,
            picUrl
        });

        // await images.forEach(async (im, i) => {
        //     const imageUri = await s3Uploader(im.imageUri, `${title}-${makePinCode(4)}-${i}.jpg`);
        //     category.images.push({ imageUri })
        //     await category.save()
        // })

        return res.status(200).json({
            data: category,
            msg: 'Category created.',
        });
    } catch (err) {
        console.log(err.message)
        next(err)
    }
}

export const updateCategories = async (req, res, next) => {
    try {
        req.body.data.forEach(async (c, i) => {
            const category = await Category.findById(c._id);
            category.sort = i + 1;
            await category.save();
        })
        return res.status(200).json({
            msg: 'Categories updated.',
        });
    } catch (err) {
        next(err)
    }
}

export const updateCategory = async (req, res, next) => {
    const {
        title,
        shortDescription,
        description,
        images
    } = req.body;

    try {
        const category = await Category.findById(req.params._id);

        category.title = title;
        category.shortDescription = shortDescription;
        category.description = description;
        
        category.images = [];

        await category.save();

        await images.forEach(async (im, i) => {
            const imageUri = !im._id
                ? await s3Uploader(im.imageUri, `${title}-${makePinCode(4)}-${i}.jpg`)
                : im.imageUri;
            category.images.push({ imageUri })
            await category.save()
        })

        return res.status(200).json({ data: category, msg: 'Category updated.' });
    } catch (err) {
        next(err);
    }
}

export const deleteCategories = async (req, res, next) => {
    try {
        req.body._ids.forEach(async _id => {
            await Category.findByIdAndRemove(_id);
        })
        return res.status(200).json({ msg: 'Categories deleted.' });
    } catch (err) {
        next(err)
    }
}