import mongoose from 'mongoose';
import { pointSchema } from '../utils/schemas.js';

const { Schema, model } = mongoose;


const courierSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    profilePhoto: String,
    phoneNumber: String,
    state: {
        type: String,
        enum: ['idle', 'busy', 'fired'],
        default: 'idle'
    },
    location: {
        type: pointSchema,
        required: true
    },
}, { timestamps: true });


const Courier = model('Courier', courierSchema);


export default Courier;