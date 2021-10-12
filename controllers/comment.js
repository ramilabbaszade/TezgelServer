import { MongooseQueryParser } from 'mongoose-query-parser';
import Comment from '../models/comment.js';
import { NotAuthorized, BadRequest } from "../utils/errors.js";
import s3Uploader from '../utils/s3-uploader.js';

const parser = new MongooseQueryParser();

export const getComment = async (req, res, next) => {
    try {
        return res.json({ data: await Comment.findById(req.params._id) });
    } catch (err) {
        next(err)
    }
}

export const getComments = async (req, res, next) => {
    const { filter, sort, limit, skip, select } = parser.parse(req.query)

    try {
        const comments = await Comment
            .find(filter)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .select(select)
            .populate('_products')

        const count = await Comment.countDocuments();

        return res.json({
            data: comments,
            count,
            limit,
            skip
        });
    } catch (err) {
        next(err)
    }
}

export const createComment = async (req, res, next) => {
    const {
        title,
        description
    } = req.body;
    try {
        const count = await Comment.countDocuments();

        const comment = await Comment.create({
            title,
            description,
            sort: count + 1
        });

        return res.status(200).json({ data: comment, 
            msg: 'Rəyiniz göndərildi. Təşəkkür edirik.', 
         });
    } catch (err) {
        next(err)
    }
}

export const updateComments = async (req, res, next) => {
    try {
        req.body.data.forEach(async (c, i) => {
            const comment = await Comment.findById(c._id);
            comment.sort = i + 1;
            await comment.save();
        })
        return res.status(200).json({
            msg: 'Comments updated.', 
         });
    } catch (err) {
        next(err)
    }
}

export const updateComment = async (req, res, next) => {
    const {
        title,
        description
    } = req.body;

    try {
        const comment = await Comment.findById(req.params._id);

        comment.title = title;
        comment.description = description;

        return res.status(200).json({ data: comment, msg: 'Comment updated.' });
    } catch (err) {
        next(err);
    }
}

export const deleteComments = async (req, res, next) => {
    try {
        req.body._ids.forEach(async _id => {
            await Comment.findByIdAndRemove(_id);
        })
        return res.status(200).json({ msg: 'Comments deleted.' });
    } catch (err) {
        next(err)
    }
}