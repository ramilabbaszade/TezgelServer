import { MongooseQueryParser } from 'mongoose-query-parser';
import Product from '../models/product.js';
import Category from '../models/category.js';
import { NotAuthorized, BadRequest } from "../utils/errors.js";

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


export const updateProducts = async (req, res, next) => {
    try {
        req.body.data.forEach(async (c, i) => {
            const product = await Product.findById(c._id);
            product.sort = i + 1;
            await product.save();
        })
        return res.status(200).json({
            msg: 'Products updated.', 
         });
    } catch (err) {
        next(err)
    }
}


export const createProduct = async (req, res, next) => {
    const {
        title,
        shortDescription,
        description,
        price,
        salePrice,
        images,
        _category,
    } = req.body;
    try {
        const c = await Product.findOne({ title });
        if (c) throw new BadRequest('Product already created with title')
        const product = await Product.create({
            title,
            shortDescription,
            description,
            price,
            salePrice,
            _category,
            images
        });

        const category = await Category.findById(_category);

        category._products.push(product._id)

        await category.save();

        return res.status(200).json({
            data: product,
            msg: 'Product created.',
        });
    } catch (err) {
        next(err)
    }
}

export const updateProduct = async (req, res, next) => {
    const {
        firstName,
        lastName,
        emailAddress,
        receivers,
        isForeign,
        password,
        role,
        _branch
    } = req.body;

    try {
        // const product = await Product.findById(req.params._id);

        // if (!product)
        //     return res
        //         .status(404)
        //         .send({ msg: await getTranslation(translationKeys.NOT_FOUND.key, req.lang) });

        // if ((req.currentProductRole !== 'admin' && product.role !== 'customer')
        //     && (req.currentProductRole === 'customer' && product._id !== req.currentProductId))
        //     throw new NotAuthorized(translationKeys.PERMISSION_ERROR.key);

        // const emailAlreadyInUse = await Product.findOne({ 'email.address': emailAddress.toLowerCase() });

        // if (emailAlreadyInUse && emailAlreadyInUse.email.address !== product.email.address)
        //     throw new BadRequest(translationKeys.EMAIL_ALREADY_IN_USE.key)

        // product.firstName = firstName;
        // product.lastName = lastName;
        // product.email.address = emailAddress;
        // product.receivers = receivers;
        // product.isForeign = isForeign;
        // product.password = await bcrypt.hash(password, 12);
        // product.role = role;
        // product._branch = _branch;

        // await product.save();

        // return res.status(200).json({ product, msg: 'Product başarıyla güncellendi.' });
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