import popups from "../data/popups.js";
import Setting, { getSettingValue } from "../models/setting.js";
import Cart from "../models/cart.js";
import Order from "../models/order.js";
import Warehouse from "../models/warehouse.js";
import { NotAuthorized, NotFound, BadRequest } from '../utils/errors.js';
import {calculateDeliveryCost, calculateCartCost, fixPrice} from "../utils/helpers.js";
import { price } from "../utils/format.js";
import User from '../models/user.js'
import createPaymesPayment from "../utils/paymes.js";
import path from 'path'
import Referrer from "../models/referrer.js";

export const getOrder = async (req, res, next) => {
    try {
        const auth = req.currentUser;
        if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');

        const order = await Order
            .findOne({ _user: auth._user, _id: req.params._id })
            .populate({
                path: 'cart',
                populate: {
                    path: '_product',
                    model: 'Product'
                }
            }).populate('_courier').populate('_warehouse')

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
                _user: auth._user,
                state: { $nin: ['cancelled', 'delivered'] }
            })
            : await Order.find({
                _user: auth._user,
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

        const { note, leftDoor, dontRing, paymentMethod, address, referrerValues } = req.body;

        if (!address) throw new BadRequest('Ünvanın seçilməyi zəruridir.')

        const cart = await Cart.find({ _user: auth._user }).populate({
            path: '_product',
            model: 'Product',
            select: 'price'
        });




        const MAX_DISTANCE_IN_KM = await getSettingValue('MAX_DISTANCE_IN_KM')
        const warehouse = await Warehouse.findOne({
            type: 'primary', location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: address.location.coordinates
                    },
                    $maxDistance: MAX_DISTANCE_IN_KM * 1000,
                }
            }
        })

        if (!warehouse)
            throw new BadRequest('Seçilən ünvan xidmət şəbəkəsi əhatə dairəsində görsənmir.')

        const cartCost = await calculateCartCost(cart);
        const deliveryCost = await calculateDeliveryCost(address, warehouse);
        const totalCost = cartCost + deliveryCost;

        if (cartCost <= warehouse.minCartTotal)
            throw new BadRequest(`Minimum səbət dəyəri: ${price(warehouse.minCartTotal)}. Sifariş vermək üçün səbətinizə ${price(warehouse.minCartTotal - cartCost + 0.01)} dəyərində məhsul artırın.`)

        if (paymentMethod === 'card') {
            try {
                const user = await User.findById(auth._user);
                const response = await createPaymesPayment({
                    productPrice: fixPrice(totalCost),
                    productName: 'Tezgel sifariş',
                    firstName: user.displayName,
                    lastName: ' ',
                    email: 'info@tezgel.az'
                })
                if (response.url) {
                    await createOrder1({
                        auth, note, leftDoor, address, dontRing,
                        state: 'cancelled',
                        method: paymentMethod,
                        cart, warehouse, cartCost, deliveryCost, totalCost, paymesOrderId: response.orderId, isPaid: false,
                        referrerValues
                    });
                    return res.json({ status: 'success', url: response.url })
                } else {
                    return res.json({ status: 'error', msg: 'Ödəniş uğurlu olmadı.' })
                }
            } catch (error) {
                return res.json({ status: 'error', msg: 'Ödəniş uğurlu olmadı.' })
            }
        } else {
            const order = await createOrder1({
                auth, note, leftDoor, method: paymentMethod, address, dontRing,
                cart, warehouse, cartCost, deliveryCost, totalCost, isPaid: false,
                referrerValues
            });
            return res.json({ status: 'success', order, popup: popups['create_order'] });
        }
    } catch (error) {
        next(error)
    }
}

export const calculateCourier = async (req,res,next) => {
    try {
        const {address} = req.body;
        const MAX_DISTANCE_IN_KM = await getSettingValue('MAX_DISTANCE_IN_KM')
        const warehouse = await Warehouse.findOne({
            type: 'primary', location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: address.location.coordinates
                    },
                    $maxDistance: MAX_DISTANCE_IN_KM * 1000,
                }
            }
        })

        if (!warehouse)
            throw new BadRequest('Seçilən ünvan xidmət şəbəkəsi əhatə dairəsində görsənmir.')

        const deliveryCost = await calculateDeliveryCost(address, warehouse);
        return res.json({deliveryCost});
    } catch (error) {
        next(error)
    }
}


export const paymesReturn = async (req, res, next) => {
    try {

        const { orderId, status } = req.body;

        if (status === 'PAYMENT_ERROR') {
            await Order.deleteOne({ 'payment.paymesOrderId': orderId });
            return res.sendFile(path.join(__dirname, '/views/payment_return_error.html'));
        }

        const order = await Order.findOne({ 'payment.paymesOrderId': orderId })
        order.isPaid = true
        order.state = 'created'
        order.save()
        await Cart.deleteMany({ _user: order._user })

        return res.sendFile(path.join(__dirname, '/views/payment_return_success.html'));
    } catch (error) {
        next(error)
    }
}

export const updateOrder = async (req, res, next) => {
    try {
        const auth = req.currentUser;
        if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');

        const { _id, note, leftDoor, dontRing } = req.body;

        await Order.findOneAndUpdate({ _id }, { note, leftDoor, dontRing })
        return res.json({ status: 'success' })
    } catch (error) {
        next(error)
    }
}

async function createOrder1({ auth, note, leftDoor, address, paymentMethod, dontRing, cart, warehouse,
    state,
    cartCost, deliveryCost, totalCost, isPaid, paymesOrderId, referrerValues }) {
    const order = await Order.create({
        _user: auth._user,
        note,
        state,
        leftDoor,
        address,
        dontRing,
        cart,
        _warehouse: warehouse._id,
        payment: {
            cartCost:fixPrice(cartCost),
            deliveryCost:fixPrice(deliveryCost),
            totalCost:fixPrice(totalCost),
            isPaid,
            method: paymentMethod
        }
    });

    await order.save();

    let user = await User.findById(auth._user)

    const { id, activeReferProductsTotalPrice } = referrerValues

    if (!user.isUsedReferrerCode) {
        if (activeReferProductsTotalPrice > 0) {
            await User.updateOne({ _id: auth._user }, { isUsedReferrerCode: true })
            await Referrer.updateOne({ _id: id }, {
                $push: {
                    orders: {
                        orderId: order._id, activeReferProductsTotalPrice
                    }
                }
            })
        }
    }

    !paymesOrderId && await Cart.deleteMany({ _user: auth._user });
    return order;
}
