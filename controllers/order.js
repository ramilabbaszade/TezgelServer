import popups from "../data/popups.js";
import Setting, { getSettingValue } from "../models/setting.js";
import Cart from "../models/cart.js";
import Order from "../models/order.js";
import Warehouse from "../models/warehouse.js";
import { NotAuthorized, NotFound, BadRequest } from '../utils/errors.js';
import { calculateDeliveryCost, calculateCartCost } from "../utils/helpers.js";
import { price } from "../utils/format.js";

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

        const { note, leftDoor, dontRing, paymentMethod, address } = req.body;

        if (!address) throw new BadRequest('Ünvanın seçilməyi zəruridir.')

        const cart = await Cart.find({ _user: auth._user }).populate({
            path: '_product',
            model: 'Product',
            select: 'price'
        });


        const cartCost = await calculateCartCost(cart);
        const deliveryCost = await calculateDeliveryCost(cartCost);
        const totalCost = cartCost + deliveryCost;

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
        if (cartCost <= warehouse.minCartTotal)
            throw new BadRequest(`Minimum səbət dəyəri: ${price(warehouse.minCartTotal)}. Sifariş vermək üçün səbətinizə ${price(warehouse.minCartTotal - cartCost + 0.01)} dəyərində məhsul artırın.`)

        // Kart ile odenish burda olacaq.   
        // En yaxin idle couriere attach olunacaq eger yoxdursa olmayacaq

        const order = await Order.create({
            _user: auth._user,
            note,
            leftDoor,
            address,
            dontRing,
            cart,
            _warehouse: warehouse._id,
            payment: {
                cartCost,
                deliveryCost,
                totalCost
            }
        })
        await order.save()

        await Cart.deleteMany({ _user: auth._user });

        return paymentMethod === 'cash'
            ? res.json({ status: 'success', order, popup: popups['create_order'] })
            : res.json({ status: 'success', html: 'Paymes 3ds html code' })
    } catch (error) {
        next(error)
    }
}
