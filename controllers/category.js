import { MongooseQueryParser } from 'mongoose-query-parser';
import Category from '../models/category.js';
import { NotAuthorized, BadRequest } from "../utils/errors.js";
import s3Uploader from '../utils/s3-uploader.js';

const parser = new MongooseQueryParser();

export const getCategory = async (req, res, next) => {
    try {
        return res.json({ data: await Category.findById(req.params._id) });
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
            .populate('_products')

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
        title,
        shortDescription,
        description,
        images
    } = req.body;
    try {
        const c = await Category.findOne({ title });

        if (c)
            throw new BadRequest('Category already created with title')

        const count = await Category.countDocuments();

        const category = await Category.create({
            title,
            shortDescription,
            description,
            sort: count + 1
        });

        await images.forEach(async (im, i) => {
            const imageUri = await s3Uploader(im.imageUri, `${title}-${i}.jpg`);
            category.images.push({ imageUri })
            await category.save()
        })

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

        await images.forEach(async (im, i) => {
            const imageUri = !im._id
                ? await s3Uploader(im.imageUri, `${title}-${i}.jpg`)
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