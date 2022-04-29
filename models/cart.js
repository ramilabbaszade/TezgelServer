import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const cartSchema = new Schema({
    _user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    qty: {
        type: Number,
        required: true
    },
    _product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
    }
}, { timestamps: true });


const Cart = model('Cart', cartSchema);


export default Cart;