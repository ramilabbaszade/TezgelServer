import mongoose from 'mongoose';
import orderStates from '../data/orderStates.js';
import { pointSchema } from '../utils/schemas.js';

const { Schema, model } = mongoose;


const orderSchema = new Schema({
    _user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    note: String,
    leftDoor: {
        type: Boolean,
        default: false
    },
    dontRing: {
        type: Boolean,
        default: false
    },
    cart: [new Schema({
        qty: Number,
        _product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
        }
    })],
    type: {
        type: String,
        enum: ['market', 'taxi', 'restaurant'],
        default: 'market'
    },
    state: {
        type: String,
        enum: orderStates,
        default: 'created'
    },
    payment: new Schema({
        cartCost: {
            required: true,
            type: Number
        },
        deliveryCost: {
            required: true,
            type: Number
        },
        totalCost: {
            required: true,
            type: Number
        },
        isPaid: {
            type: Boolean,
            default: false
        },
        
    }),
    _courier: {
        type: Schema.Types.ObjectId,
        ref: "Courier",
    },
    _warehouse: {
        type: Schema.Types.ObjectId,
        ref: "Warehouse",
    },
    address: new Schema({
        name: String,
        directions: String,
        phoneNumber: String,
        location: {
            type: pointSchema,
            required: true
        }
    })
}, { timestamps: true });


const Order = model('Order', orderSchema);

export default Order;