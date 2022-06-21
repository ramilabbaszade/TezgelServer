import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const stockSchema = new Schema({
    _supplier: {
        type: Schema.Types.ObjectId,
        ref: "Supplier",
    },
    _product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
    },
    _cashbox: {
        type: Schema.Types.ObjectId,
        ref: "Cashbox",
    },
    _warehouse: {
        type: Schema.Types.ObjectId,
        ref: "Warehouse",
    },
    qty: Number,
    buyPrice: Number,
    buyDiscount: Number,
    buyAmount: Number,
    salePrice: Number,
    saleDiscount: Number,
    saleAmount: Number
}, { timestamps: true });


const Stock = model('Stock', stockSchema);


export default Stock;
