import mongoose from 'mongoose';
import { pointSchema } from '../utils/schemas.js'

const { Schema, model } = mongoose;


const addressSchema = new Schema({
    _user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    name: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    phoneNumber: String,
    isInActive: {
        type: Boolean,
        default: false
    },
    icon: {
        type: String,
        enum: ['home', 'business', 'other'],
        default: 'home'
    },
    directions: String,
    location: {
        type: pointSchema,
        required: true,
        // index: '2d'
    }

}, { timestamps: true });


const Address = model('Address', addressSchema);


export default Address;