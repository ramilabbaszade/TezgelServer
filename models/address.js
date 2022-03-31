import mongoose from 'mongoose';
import {pointSchema} from '../utils/schemas.js'

const { Schema, model } = mongoose;


const addressSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        enum: ['home', 'business', 'other'],
        default: 'home'
    },
    directions: String,
    location: {
        type: pointSchema,
        required: true
    }

}, { timestamps: true });


const Address = model('Address', addressSchema);


export default Address;