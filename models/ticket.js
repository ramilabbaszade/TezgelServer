import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const ticketSchema = new Schema({
    messages: [new Schema({
        text: {
            type: String,
            required: true
        },
        attachmentUrl: {
            type: String,
            required: false
        },
        isSelf: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    })],
    subject: {
        type: String,
        required: true
    },
    _user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });


const Ticket = model('Ticket', ticketSchema);


export default Ticket;