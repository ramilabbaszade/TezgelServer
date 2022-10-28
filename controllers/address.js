import Address from '../models/address.js';
import { NotAuthorized, BadRequest } from '../utils/errors.js';
import User from "../models/user.js";


export const createAddress = async (req, res, next) => {
    try {
        const auth = req.currentUser;
        if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');

        const { coordinates, name, directions } = req.body;

        // TODO
        // En yaxin warehouse ile compare edilmelidi. Misal ucun 50km uzaqdirsa error verilmelidi.
        // 50 KM variable kimi settings modelda olmalidi. admin panelden editable

        const defaultAddress = await Address.findOne({ _user: auth._user, isDefault: true });
        const userInfo = await User.findOne({ _id: auth._user });

        if (defaultAddress) {
            defaultAddress.isDefault = false;
            await defaultAddress.save();
        }

        const address = await Address.create({
            _user: auth._user,
            location: { coordinates },
            name,
            phoneNumber: userInfo.phoneNumber,
            directions,
            isDefault: true
        })

        await address.save();

        return res.json({ status: 'success', address, msg: 'Ünvan uğurla artırıldı.' })
    } catch (error) {
        next(error)
    }
}


export const putAddress = async (req, res, next) => {
    try {
        const auth = req.currentUser;
        if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');
        const { defaultAddressId } = req.body;
        const defaultAddress = await Address.findOne({ _user: auth._user, isDefault: true });
        if (defaultAddress) {
            defaultAddress.isDefault = false;
            await defaultAddress.save();
        }
        const newDefaultAddress = await Address.findOne({ _id: defaultAddressId });
        
        newDefaultAddress.isDefault = true;
        await newDefaultAddress.save();
        return res.json({ status: 'success', msg: 'Ünvan uğurla dəyişdirildi.'})
    } catch (error) {
        next(error)
    }
}


export const removeAddress = async (req, res, next) => {
    try {
        const auth = req.currentUser;
        if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');
        const {addressId} = req.body;

        const address = await Address.findOne({_id: addressId})

        if (address.isDefault) throw new BadRequest('Seçili ünvan silinə bilməz.');

        address.isInActive = true;

        await address.save();

        return res.json({ status: 'success', msg: 'Ünvan uğurla silindi.' })
    } catch (error) {
        next(error)
    }
}


export const getAddresses = async (req, res, next) => {
    try {
        const auth = req.currentUser;
        if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');
        const addresses = await Address.find({ _user: auth._user, isInActive: false });
        return res.json({ status: 'success', addresses })
    } catch (error) {
        next(error)
    }
}
