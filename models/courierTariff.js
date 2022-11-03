import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const courierTariffSchema = new Schema({
    price: Number,
    km:{
        type: Number,
        required: true,
    },
    minPrice: Number
}, { timestamps: true });

const CourierTariff = model('CourierTariff', courierTariffSchema);

export default CourierTariff;