import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const cartSchema = new Schema({
    userId: {
        type: String,
        required: true
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