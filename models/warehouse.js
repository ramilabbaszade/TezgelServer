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
    maxDistance: Number, // 20 km
    minCartTotal: Number, // exp 5
    location: {
        type: pointSchema,
        required: true,
        // index: '2d'
    },
    stocks: [new Schema({
        qty: Number,
        _product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
        }
    })],
}, { timestamps: true });


const warehouse = model('warehouse', warehouseSchema);


export default warehouse;