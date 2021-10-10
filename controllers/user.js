import { MongooseQueryParser } from 'mongoose-query-parser';
import { NotAuthorized, BadRequest } from "../utils/errors.js";

const parser = new MongooseQueryParser();

export const getUser = async (req, res, next) => {
    try {
        // if (req.currentUserRole !== 'customer' || req.currentUserRole !== 'blackList' || req.params._id === req.currentUserId)
        //     return res.json({ user: await User.findById(req.params._id).select('-password') });
        // throw new NotAuthorized(translationKeys.PERMISSION_ERROR.key);
    } catch (err) {
        next(err)
    }
}

export const getUsers = async (req, res, next) => {
    const { filter, sort, limit, skip, select } = parser.parse(req.query)

    try {
        // const users = await User
        //     .find(filter)
        //     .sort(sort)
        //     .limit(limit)
        //     .skip(skip)
        //     .select(select)

        // const count = await User.countDocuments();

        // return res.json({
        //     data: users,
        //     count,
        //     limit,
        //     skip
        // });
    } catch (err) {
        next(err)
    }
}

export const createUser = async (req, res, next) => {
    const {
        firstName,
        lastName,
        emailAddress,
        receivers,
        isForeign,
        password,
        role,
        _branch
    } = req.body;
    try {
        // if (req.currentUserRole !== 'admin' && role !== 'customer') {
        //     throw new NotAuthorized('Not authorized');
        // }
        // const registeredByEmailAddress = await User.findOne({ 'email.address': emailAddress.toLowerCase() });

        // if (registeredByEmailAddress)
        //     throw new BadRequest(translationKeys.EMAIL_ALREADY_IN_USE.key);

        // const hashedPassword = await bcrypt.hash(password, 12);

        // const user = await User.create({
        //     firstName,
        //     lastName,
        //     password: hashedPassword,
        //     'email.address': emailAddress,
        //     receivers,
        //     isForeign,
        //     _branch
        // });

        // return res.status(200).json({ user, 
        //     msg: `${await getTranslation(translationKeys.USER)} ${await getTranslation(translationKeys.CREATED)}`, 
        //  });
    } catch (err) {
        next(err)
    }
}

export const updateUser = async (req, res, next) => {
    const {
        firstName,
        lastName,
        emailAddress,
        receivers,
        isForeign,
        password,
        role,
        _branch
    } = req.body;

    try {
        // const user = await User.findById(req.params._id);

        // if (!user)
        //     return res
        //         .status(404)
        //         .send({ msg: await getTranslation(translationKeys.NOT_FOUND.key, req.lang) });

        // if ((req.currentUserRole !== 'admin' && user.role !== 'customer')
        //     && (req.currentUserRole === 'customer' && user._id !== req.currentUserId))
        //     throw new NotAuthorized(translationKeys.PERMISSION_ERROR.key);

        // const emailAlreadyInUse = await User.findOne({ 'email.address': emailAddress.toLowerCase() });

        // if (emailAlreadyInUse && emailAlreadyInUse.email.address !== user.email.address)
        //     throw new BadRequest(translationKeys.EMAIL_ALREADY_IN_USE.key)

        // user.firstName = firstName;
        // user.lastName = lastName;
        // user.email.address = emailAddress;
        // user.receivers = receivers;
        // user.isForeign = isForeign;
        // user.password = await bcrypt.hash(password, 12);
        // user.role = role;
        // user._branch = _branch;

        // await user.save();

        // return res.status(200).json({ user, msg: 'User başarıyla güncellendi.' });
    } catch (err) {
        next(err);
    }
}

export const deleteUsers = async (req, res, next) => {
    try {
        // req.body._ids.forEach(async _id => {
        //     await User.findByIdAndRemove(_id);
        // })
        // return res.status(200).json({ msg: 'Userler başarıyla silindi.' });
    } catch (err) {
        next(err)
    }
}