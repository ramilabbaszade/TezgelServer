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
        const tickets = await Ticket.find({'_user': auth._user})

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
        message,
        subject,
    } = req.body;


    try {
        const ticket = await Ticket.create({
            messages: [{
                text: message
            }],
            subject,
            _user: auth._user
        })

        await ticket.save();

        return res.json({ ticket, status: 'success' })

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
        console.log(ticket._user, auth._user)
        if (!ticket || ticket._user != auth._user)
            throw new BadRequest('Müraciət tapılmadı')

        ticket.messages.push({
            text: newMessage
        })

        await ticket.save();

        return res.json({ status: 'success' })

    } catch (err) {
        console.log(err.message)
        next(err)
    }
}
