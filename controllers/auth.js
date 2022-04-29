import OTP from "../models/otp.js";
import User from "../models/user.js";
import { makePinCode } from "../utils/helpers.js";
import SmsSender from "../utils/sms-sender.js";
import {BadRequest, NotAuthorized} from '../utils/errors.js'
import jwt from 'jsonwebtoken';

export const login = async (req, res, next) => {
    try {
        const { phoneNumber, isRegister } = req.body;

        const user = await User.findOne({phoneNumber})

        if (user && isRegister) throw new BadRequest('Bu nömrə ilə qeydiyyat mövcutdur.')
        if (!user && !isRegister) throw new BadRequest('İstifadəçi tapılmadı.')

        const code = makePinCode(4, true)

        const otp = await OTP.create({
            phoneNumber,
            code
        })

        await otp.save()

        
        const smsSender = new SmsSender(phoneNumber, `${code} sifresi ile tezgele daxil ola bilersiniz. `)

        const r = await smsSender.sendSms()

        console.log(code)

        return res.json({status: 'success', msg: 'Aktivasiya kodu uğurla göndərildi.', expires: 180})
    } catch (error) {
        next(error)
    }
}


export const getToken = async (req, res, next) => {
    try {
        const { code, phoneNumber, isRegister } = req.body;

        let user = await User.findOne({phoneNumber})

        if (!user && !isRegister) throw new BadRequest('İstifadəçi tapılmadı.');

        const otp = await OTP.findOne({phoneNumber, code})

        if (!otp) throw new BadRequest('Kod səhvdir, zəhmət olmasa, təkrar yoxlayın.');

        if (isRegister) {
            user = await User.create({phoneNumber});
            await user.save()
        }

        const token = jwt.sign(
            {
                _user: user._id
            },
            process.env.SECRET_KEY,
            { expiresIn: process.env.TOKEN_EXPIRATION_TIME }
        )

        user.lastLoginDate = new Date();
        user.lastLoginIp = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
        await user.save();

        return res.json({status: 'success', token, user})
    } catch (error) {
        next(error)
    }
}



export const getUser = async (req, res, next) => {
    try {
        const auth = req.currentUser;
        if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');

        const user = await User.findOne({_id: auth._user})

        
        return res.json({status: 'success', user})
    } catch (error) {
        next(error)
    }
}



export const updateUser = async (req, res, next) => {
    try {
        const auth = req.currentUser;
        if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');

        const { displayName } = req.body;

        await User.updateOne({_id: auth._user}, {displayName})

        
        return res.json({status: 'success'})
    } catch (error) {
        next(error)
    }
}

