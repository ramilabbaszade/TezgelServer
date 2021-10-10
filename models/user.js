import mongoose from 'mongoose';
import autoIncrement from 'mongoose-sequence';
import currencies from '../data/currencies.js';

const { Schema, model } = mongoose;

const transactionSchema = new Schema({
    currency: {
        type: String,
        enum: currencies,
        default: 'USD'
    },
    amount: Number,
    description: String
})
 
const walletSchema = new Schema({
    credits: [
        transactionSchema
    ],
    debits: [
        transactionSchema
    ]
})

const userSchema = Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        address: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
        },
        isConfirmed: String
    },
    wallet: walletSchema,
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['customer', 'partner', 'employee', 'callCenter', 'admin', 'blackList'],
        default: 'customer'
    },
    phone: {
        dialCode: String,
        number: String,
        isConfirmed: String,
    },
    receivers: [
        new Schema({
            fullName: String,
            pinCode: String,
            identityNumber: String,
            address: String,
            isDefault: {
                type: Boolean,
                default: false
            },
            isForeign: {
                type: Boolean,
                default: false
            },
        }, { timestamps: true })
    ],
    _branch: {
        type: Schema.Types.ObjectId,
        ref: "Branch",
    },
    imageUri: String,
    lastLoginDate: Date,
    lastLoginIp: String,
}, { timestamps: true });

const AutoIncrement = autoIncrement(mongoose);

userSchema.plugin(AutoIncrement, { inc_field: 'userId' });

const User = model('User', userSchema);

export default User;
