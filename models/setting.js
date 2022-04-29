import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const settingSchema = new Schema({
    key: {
        type: String,
        unique: true,
        required: true
    },
    value: {
        type: {},
        required: true
    }
});


const Setting = model('Setting', settingSchema);

export const getSettingValue = async (key) => {
    const setting = await Setting.findOne({key})
    return setting.value;
}

export default Setting;