import { MongooseQueryParser } from 'mongoose-query-parser';
import Category from '../models/category.js';
import Product from '../models/product.js';
import { NotAuthorized, BadRequest } from "../utils/errors.js";
import { makePinCode } from '../utils/helpers.js';
import s3Uploader from '../utils/s3-uploader.js';
import { default as nodeFetch } from 'node-fetch';
import Ticket from '../models/ticket.js';
import User from '../models/user.js'

export const getTickets = async (req, res, next) => {
    const auth = req.currentUser;
        if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');

    try {
        const tickets = await Ticket.find({'user.id': auth._user})

        return res.json({
            tickets,
            status: 'success'
        });
    } catch (err) {
        next(err)
    }
}


export const createTicket = async (req, res, next) => {
    const auth = req.currentUser;
    if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');

    const {
        newMessage,
        subject
    } = req.body;


    try {
        const ticket = await Ticket.create({
            messages: [newMessage],
            subject,
            _user: auth._user
        })

        await ticket.save();

        return res.json({ status: 'success' })

    } catch (err) {
        console.log(err.message)
        next(err)
    }
}



export const sendMessage = async (req, res, next) => {
    const auth = req.currentUser;
    if (!auth) throw new NotAuthorized('Zəhmət olmasa, daxil olun.');

    const {
        newMessage,
        _ticket
    } = req.body;


    try {
        let ticket = await Ticket.findById(_ticket)

        if (!ticket || ticket._user !== auth._user)
            return new BadRequest('Müraciət tapılmadı')

        ticket.messages.push(newMessage)

        await ticket.save();

        return res.json({ status: 'success' })

    } catch (err) {
        console.log(err.message)
        next(err)
    }
}
