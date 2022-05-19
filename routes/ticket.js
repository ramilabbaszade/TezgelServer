import express from 'express';
import {
    createTicket, getTickets, sendMessage
} from '../controllers/ticket';

const router = express.Router();

router.post('/', createTicket)
router.get('/', getTickets)
router.put('/send-message', sendMessage)

export default router;