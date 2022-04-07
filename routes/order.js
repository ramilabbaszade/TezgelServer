import express from 'express';
import {
    createOrder, getOrder, getOrders
} from '../controllers/order.js';

const router = express.Router();

router.post('/', createOrder)
router.get('/', getOrders)
router.get('/:_id', getOrder)

export default router;