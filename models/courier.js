import mongoose from 'mongoose';

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
    }
}, { timestamps: true });


const Courier = model('Courier', courierSchema);


export default Courier;