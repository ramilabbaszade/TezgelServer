import popups from "../data/popups.js";
import Cart from "../models/cart.js";
import Order from "../models/order.js";
import { NotAuthorized } from '../utils/errors.js';
import { calculateDeliveryCost, calculateCartCost } from "../utils/helpers.js";


export const getOrders = async (req, res, next) => {
    try {
        const auth = req.currentUser;
        if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');

        const {actives} = req.params;
        const orders = actives === 'yes'
        ? await Order.find({userId: auth.user_id, quantity: { $nin: [ 'cancelled', 'delivered' ]} })
        : await Order.find({userId: auth.user_id})
        
        return res.json({ status: 'success', orders })
    } catch (error) {
        next(error)
    }
}


export const createOrder = async (req, res, next) => {
    try {
        const auth = req.currentUser;
        if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');

        const { note, leftDoor, dontRing, paymentMethod } = req.body;

        const cart = await Cart.find({ userId: auth.user_id }).populate({
            path: '_product',
            model: 'Product',
            select: 'price'
        });

        const cartCost = await calculateCartCost(cart);
        const deliveryCost = await calculateDeliveryCost(cartCost);
        const totalCost = cartCost + deliveryCost;

        // Kart ile odenish burda olacaq.
        // Istifadeci default address _id 

        const order = await Order.create({
            userId: auth.user_id,
            note,
            leftDoor,
            dontRing,
            payment: {
                cartCost,
                deliveryCost,
                totalCost
            }
        })
        await order.save()



        return paymentMethod === 'cash'
            ? res.json({ status: 'success', order, popup: popups['create_order'] })
            : res.json({ status: 'success', html: 'Paymes 3ds html code' })
    } catch (error) {
        next(error)
    }
}


