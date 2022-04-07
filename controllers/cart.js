import Address from '../models/address.js';
import Cart from '../models/cart.js';
import Warehouse from '../models/warehouse.js';
import { BadRequest, NotAuthorized } from '../utils/errors.js';

export const updateCart = async (req, res, next) => {
    try {
        const auth = req.currentUser;
        if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');
        
        const {cartItem} = req.body;
        
        const address = await Address.findOne({isDefault: true, userId: auth.user_id})

        if (!address) throw new BadRequest('Ünvanın seçilməyi zəruridir.')

        const warehouse = await Warehouse.find({location: {  $near: {
            $geometry:{ 
                type: "Point", 
                coordinates: address.location.coordinates
            },
            $maxDistance: 50000,
        }}})

        // check warehouse.stocks to 

        console.log(warehouse)

        const cart = await Cart.findOne({userId: auth.user_id, _product: cartItem._product});

        if (!cart) {
            const cItem = await Cart.create(cartItem);
            await cItem.save();
        } else {
            if (cartItem.qty === 0) {
                await Cart.findByIdAndRemove(cart._id);
            } else {
                cart.qty = cartItem.qty;
                await cart.save();
            }
        }


        return res.json({status: 'success'})
    } catch (error) {
        next(error)
    }
}

export const deleteCart = async (req,res,next) => {
    try {
        const auth = req.currentUser;
        if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');

        await Cart.deleteMany({userId: auth.user_id});

        return res.json({status: 'success'})
    } catch (error) {
        next(error)
    }
}

export const getCart = async (req, res, next) => {
    try {
        const auth = req.currentUser;
        if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');
    
        const select = '_id shortName struckPrice price shortDescription picUrls'

        const cart = await Cart.find({userId: auth.user_id}).populate({
            path: '_product',
            model: 'Product',
            select
        });

        return res.json({status: 'success', cart})

    } catch (error) {
        next(error)
    }
}
