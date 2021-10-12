import { MongooseQueryParser } from 'mongoose-query-parser';
import Offer from '../models/offer.js';
import { NotAuthorized, BadRequest } from "../utils/errors.js";
import s3Uploader from '../utils/s3-uploader.js';

const parser = new MongooseQueryParser();

export const getOffer = async (req, res, next) => {
    try {
        return res.json({ data: await Offer.findById(req.params._id) });
    } catch (err) {
        next(err)
    }
}

export const getOffers = async (req, res, next) => {
    const { filter, sort, limit, skip, select } = parser.parse(req.query)

    try {
        const offers = await Offer
            .find(filter)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .select(select)
            .populate('_products')

        const count = await Offer.countDocuments();

        return res.json({
            data: offers,
            count,
            limit,
            skip
        });
    } catch (err) {
        next(err)
    }
}

export const createOffer = async (req, res, next) => {
    const {
        title,
        shortDescription,
        description,
        images
    } = req.body;
    try {
        const c = await Offer.findOne({ title });

        if (c) throw new BadRequest('Offer already created with title')

        const count = await Offer.countDocuments();

        const offer = await Offer.create({
            title,
            shortDescription,
            description,
            sort: count + 1
        });

        offer.images = [];

        await offer.save();

        await images.forEach(async (im, i) => {
            const imageUri = !im._id
                ? await s3Uploader(im.imageUri, `${title}-${i}.jpg`)
                : im.imageUri;
                offer.images.push({ imageUri })
            await offer.save()
        })

        return res.status(200).json({ data: offer, 
            msg: 'Offer created.', 
         });
    } catch (err) {
        next(err)
    }
}

export const updateOffers = async (req, res, next) => {
    try {
        req.body.data.forEach(async (c, i) => {
            const offer = await Offer.findById(c._id);
            offer.sort = i + 1;
            await offer.save();
        })
        return res.status(200).json({
            msg: 'Offers updated.', 
         });
    } catch (err) {
        next(err)
    }
}

export const updateOffer = async (req, res, next) => {
    const {
        title,
        shortDescription,
        description,
        images
    } = req.body;

    try {
        const offer = await Offer.findById(req.params._id);

        offer.title = title;
        offer.shortDescription = shortDescription;
        offer.description = description;

        await images.forEach(async (im, i) => {
            const imageUri = !im._id 
                ? await s3Uploader(im.imageUri, `${title}-${i}.jpg`) 
                : im.imageUri;
            offer.images.push({imageUri})
            await offer.save()
        })

        return res.status(200).json({ data: offer, msg: 'Offer updated.' });
    } catch (err) {
        next(err);
    }
}

export const deleteOffers = async (req, res, next) => {
    try {
        req.body._ids.forEach(async _id => {
            await Offer.findByIdAndRemove(_id);
        })
        return res.status(200).json({ msg: 'Offers deleted.' });
    } catch (err) {
        next(err)
    }
}