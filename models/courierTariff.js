import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const courierTariffSchema = new Schema({
    price: {
        type: Number,
        required: true,
    },
    fromKm:{
        type: Number,
        required: true,
    },
    toKm:{
        type: Number,
        required: true,
    },
}, { timestamps: true });

const CourierTariff = model('CourierTariff', courierTariffSchema);

export default CourierTariff;