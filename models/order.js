import mongoose from 'mongoose';
import orderStates from '../data/orderStates.js';

const { Schema, model } = mongoose;


const orderSchema = new Schema({
    userId: {
        type: String,
        required: true
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
        }
    }),
    _courier: {
        type: Schema.Types.ObjectId,
        ref: "Courier",
    },
    _address: {
        type: Schema.Types.ObjectId,
        ref: "Address",
    }
}, { timestamps: true });


const Order = model('Order', orderSchema);

export default Order;