import popups from "../data/popups.js";
import Address from "../models/address.js";
import Cart from "../models/cart.js";
import Order from "../models/order.js";
import Warehouse from "../models/warehouse.js";
import { NotAuthorized, NotFound, BadRequest } from '../utils/errors.js';
import { calculateDeliveryCost, calculateCartCost } from "../utils/helpers.js";

export const getOrder = async (req, res, next) => {
    try {
        const auth = req.currentUser;
        if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');

        const order = await Order
            .findOne({userId: auth.user_id, _id: req.params._id})
            .populate({
                path: 'cart',
                populate: {
                  path: '_product',
                  model: 'Product'
            }});

        if (!order) throw new NotFound('Sifariş tapılmadı.')

        return res.json({ status: 'success', order })
    } catch (error) {
        next(error)
    }
}


export const getOrders = async (req, res, next) => {
    try {
        const auth = req.currentUser;
        if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');

        const { active } = req.query;
        const orders = active === 'yes'
            ? await Order.find({ 
                userId: auth.user_id,
                state: { $nin: ['cancelled', 'delivered'] } 
            })
            : await Order.find({ 
                userId: auth.user_id, 
                state: { $in: ['cancelled', 'delivered'] } 
            })
        return res.json({ status: 'success', orders })
    } catch (error) {
        next(error)
    }
}


export const createOrder = async (req, res, next) => {
    try {
        const auth = req.currentUser;
        if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');

        const { note, leftDoor, dontRing, paymentMethod, address } = req.body;

        if (!address) throw new BadRequest('Ünvanın seçilməyi zəruridir.')

        const cart = await Cart.find({ userId: auth.user_id }).populate({
            path: '_product',
            model: 'Product',
            select: 'price'
        });

        const cartCost = await calculateCartCost(cart);
        const deliveryCost = await calculateDeliveryCost(cartCost);
        const totalCost = cartCost + deliveryCost;

        const warehouse = await Warehouse.find({location: {  $near: {
            $geometry:{ 
                type: "Point", 
                coordinates: address.location.coordinates
            },
            $maxDistance: 50000,
        }}})


        // Kart ile odenish burda olacaq.
        // En yaxin idle couriere attach olunacaq eger yoxdursa olmayacaq

        const order = await Order.create({
            userId: auth.user_id,
            note,
            leftDoor,
            address,
            dontRing,
            cart,
            payment: {
                cartCost,
                deliveryCost,
                totalCost
            }
        })
        await order.save()

        await Cart.deleteMany({ userId: auth.user_id });

        return paymentMethod === 'cash'
            ? res.json({ status: 'success', order, popup: popups['create_order'] })
            : res.json({ status: 'success', html: 'Paymes 3ds html code' })
    } catch (error) {
        next(error)
    }
}
