import { MongooseQueryParser } from 'mongoose-query-parser';
import Category from '../models/category.js';
import Product from '../models/product.js';
import { NotAuthorized, BadRequest } from "../utils/errors.js";
import { makePinCode } from '../utils/helpers.js';
import s3Uploader from '../utils/s3-uploader.js';
import { default as nodeFetch } from 'node-fetch';

export const getCategories = async (req, res, next) => {

    try {
        const categories = await Category.find()
        
        
        
        return res.json({
            categories,
            status: 'success'
        });
    } catch (err) {
        next(err)
    }
}

export const createCategory = async (req, res, next) => {
    const {
        categories
    } = req.body;
    try {

        categories.forEach(async c => {
            const category = await Category.create(c);
            await category.save()
        })
        return res.status(200).json({
            data: categories,
            msg: 'Category created.',
        });

        
    } catch (err) {
        console.log(err.message)
        next(err)
    }
}

export const updateCategories = async (req, res, next) => {
    try {
        
        const a = [
            'yeni-urunler-OcXAkcBF1S',
            'indirimler-FED6IOddNy',
            'su-icecek-ewknEvzsJc',
            'meyve-sebze-VN2A9ap5Fm',
            'firindan-q357eEdgBs',
            'temel-gida-IQH9bir3bX',
            'atistirmalik-BaaxwkyV1y',
            'dondurma-Aw6YFhRWBI',
            'sut-urunleri-JGtfnNALTJ',
            'kahvalti-iat0l1yrkf',
            'yiyecek-0VLJmBhnI3',
            'fit-form-A9ciT987qU',
            'kisisel-bakim-A21PNmddpt',
            'ev-bakim-JXy6KcrPKW',
            'ev-yasam-jdRnndEpyl',
            'teknoloji-X6SRgY6F78',
            'evcil-hayvan-T27vt8aM7c',
            'bebek-T71m4N3D3K',
            'cinsel-saglik-viPc8mv9zd'
        ]

        a.forEach(async b => {
            const d = await nodeFetch(`https://getirx-client-api-gateway.getirapi.com/category/products?countryCode=TR&categorySlug=${b}`, {method: 'GET', headers: {'x-language': 'tr'}})
            const {data} = await d.json()
            const {category: c} = data;

            const cat = await Category.findOne({oldId: c.id});
            cat.picUrl = c.picURL
            await cat.save();

            // c.subCategories.forEach(async (subC, i) => {
            //     subC.products.forEach(async (p, j) => {
            //         try {
            //             const newP = await Product.create({
            //                 name: p.name,
            //                 shortName: p.shortName,
            //                 shortDescription: p?.shortDescription,
            //                 picUrls: [p.squareThumbnailURL],
            //                 price: p.price,
            //                 status: 1,
            //                 slug: p?.slug || i.toString(),
            //                 struckPrice: p?.struckPrice,
            //                 categoryIds: p?.categoryIds,
            //                 subCategoryIds: p?.subCategoryIds,
            //                 // bundleItems: p?.bundleItems?.map(b => ({
            //                 //     count: b?.count,
            //                 //     name: b?.name,
            //                 //     shortDescription: b?.shortDescription,
            //                 //     picUrl: b?.picUrl
            //                 // }))
            //             })
            //             await newP.save()
            //         } catch (error) {
            //             console.log(error.message)
            //         }
            //     })
            // })
            // const cat = await Category.create({
            //     slug: c.slug,
            //     oldId: c.id,
            //     productCount: c.productCount,
            //     picUrl: c.picUrl,
            //     name: c.name,
            //     subCategories: c.subCategories.map((sc, i) => ({
            //         slug: sc?.slug || i.toString(),
            //         name: sc.name,
            //         oldId: sc.id,
            //         productCount: sc.productCount,
            //         // products: sc.products.map(p => ({
            //         //     name: p.name,
            //         //     shortName: p.shortName,
            //         //     shortDescription: p?.shortDescription,
            //         //     picUrls: [p.squareThumbnailURL],
            //         //     price: p.price,
            //         //     status: 1,
            //         //     slug: p?.slug || i.toString(),
            //         //     struckPrice: p?.struckPrice,

            //         // }))
            //     }))
            // })
            // await cat.save()
        })

        return res.status(200).json({
            msg: 'Categories updated.',
        });
    } catch (err) {
        next(err)
    }
}

// export const updateCategories = async (req,res,next) => {
//     try {
//         // const products = await Product.find({ _subCategories: { $exists: true, $ne: [] } })
//         // console.log(products.length)
//         // return
//         const products = await Product.find();
//         products.forEach(async p => {
//             const relatedCategories = await Category.find({oldId: {$in : p.categoryIds}}).populate('subCategories')
//             p._categories = relatedCategories.map(r => r._id);
//             relatedCategories.forEach(async r => {
//                 r.subCategories.forEach(async s => {
//                     console.log(`s.oldId: ${s.oldId}, p.subCategoryIds: ${p.subCategoryIds}`)
//                     if (p.subCategoryIds.includes(s.oldId)) {
//                         p._subCategories.push(s._id);
//                         console.log(s._id)
//                     }
//                 })
//             })
//             await p.save()
//         })
//         return res.status(200).json({msg: 'asd'})
//     } catch (error) {
//         next(error)
//     }
// }

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