import { MongooseQueryParser } from 'mongoose-query-parser';
import Article from '../models/article.js';
import { NotAuthorized, BadRequest } from "../utils/errors.js";
import s3Uploader from '../utils/s3-uploader.js';

const parser = new MongooseQueryParser();

export const getArticle = async (req, res, next) => {
    try {
        return res.json({ data: await Article.findById(req.params._id) });
    } catch (err) {
        next(err)
    }
}

export const getArticles = async (req, res, next) => {
    const { filter, sort, limit, skip, select } = parser.parse(req.query)

    try {
        const articles = await Article
            .find(filter)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .select(select)
            .populate('_products')

        const count = await Article.countDocuments();

        return res.json({
            data: articles,
            count,
            limit,
            skip
        });
    } catch (err) {
        next(err)
    }
}

export const createArticle = async (req, res, next) => {
    const {
        title,
        shortDescription,
        description,
        images
    } = req.body;
    try {
        const c = await Article.findOne({ title });

        if (c) throw new BadRequest('Article already created with title')

        const count = await Article.countDocuments();

        const article = await Article.create({
            title,
            shortDescription,
            description,
            sort: count + 1
        });

        await images.forEach(async (im, i) => {
            const imageUri = await s3Uploader(im.imageUri, `${title}-${i}.jpg`);
            article.images.push({imageUri})
            await article.save()
        })

        return res.status(200).json({ data: article, 
            msg: 'Article created.', 
         });
    } catch (err) {
        next(err)
    }
}

export const updateArticles = async (req, res, next) => {
    try {
        req.body.data.forEach(async (c, i) => {
            const article = await Article.findById(c._id);
            article.sort = i + 1;
            await article.save();
        })
        return res.status(200).json({
            msg: 'Articles updated.', 
         });
    } catch (err) {
        next(err)
    }
}

export const updateArticle = async (req, res, next) => {
    const {
        title,
        shortDescription,
        description,
        images
    } = req.body;

    try {
        const article = await Article.findById(req.params._id);

        article.title = title;
        article.shortDescription = shortDescription;
        article.description = description;

        article.images = [];

        await article.save();

        await images.forEach(async (im, i) => {
            const imageUri = !im._id
                ? await s3Uploader(im.imageUri, `${title}-${i}.jpg`)
                : im.imageUri;
                article.images.push({ imageUri })
            await article.save()
        })

        return res.status(200).json({ data: article, msg: 'Article updated.' });
    } catch (err) {
        next(err);
    }
}

export const deleteArticles = async (req, res, next) => {
    try {
        req.body._ids.forEach(async _id => {
            await Article.findByIdAndRemove(_id);
        })
        return res.status(200).json({ msg: 'Articles deleted.' });
    } catch (err) {
        next(err)
    }
}