import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const otpSchema = new Schema({
    code: String,
    phoneNumber: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    expireAt: {
        type: Date,
        default: Date.now() + 3 * 60
    },
});


const OTP = model('OTP', otpSchema);


export default OTP;
