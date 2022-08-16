import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const referrerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    _user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    orders:{
        type:Array,
        default:[]
    },
    referCode:{
        type: String,
        required: true,
        unique: true
    },
    percentage:{
        type: Number,
        required: true,
    },
    state: {
        type: String,
        enum: ['active', 'passive'],
        default: 'passive'
    },
}, { timestamps: true });

const Referrer = model('Referrer', referrerSchema);

export default Referrer;