import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const userSchema = new Schema({
    displayName: String,
    phoneNumber: String,
    lastLoginDate: Date,
    lastLoginIp: String,
    role: {
        type: String,
        enum: ['customer', 'operator', 'admin', 'banned', 'courier', 'warehouse'],
        default: 'customer'
    },
    profilePhoto: String
}, { timestamps: true });


const User = model('User', userSchema);


export default User;
