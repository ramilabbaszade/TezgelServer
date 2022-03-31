import Address from '../models/address.js';
import { NotAuthorized } from '../utils/errors.js';


export const createAddress = async (req, res, next) => {
    try {
        const auth = req.currentUser;
        if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');
        
        const {coordinates, name, directions} = req.body;

        // TODO
        // En yaxin warehouse ile compare edilmelidi. Misal ucun 50km uzaqdirsa error verilmelidi.
        // 50 KM variable kimi settings modelda olmalidi. admin panelden editable

        const address = await Address.create({
            userId: auth.user_id,
            location: {coordinates}, 
            name, 
            directions
        })

        await address.save();

        return res.json({status: 'success', address, msg: 'Ünvan uğurla artırıldı.'})
    } catch (error) {
        next(error)
    }
}



export const getAddresses = async (req, res, next) => {
    try {
        const auth = req.currentUser;
        if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');
        
        return res.json({status: 'success'})
    } catch (error) {
        next(error)
    }
}
