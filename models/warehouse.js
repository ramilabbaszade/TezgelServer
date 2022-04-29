import mongoose from 'mongoose';
import { pointSchema } from '../utils/schemas.js';

const { Schema, model } = mongoose;

const warehouseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: String,
    state: {
        type: String,
        enum: ['active', 'busy', 'fired'],
        default: 'active'
    },
    type: {
        type: String,
        enum: ['primary', 'market', 'restaurant'],
        default: 'primary'
    },
    minCartTotal: Number,
    location: {
        type: pointSchema,
        required: true
    },
    stocks: [new Schema({
        qty: Number,
        _product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
        }
    })],
}, { timestamps: true });


const Warehouse = model('Warehouse', warehouseSchema);


export default Warehouse;