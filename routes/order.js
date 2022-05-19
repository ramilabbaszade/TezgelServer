import express from 'express';
import {
    createOrder, getOrder, getOrders, updateOrder
} from '../controllers/order.js';

const router = express.Router();

router.post('/', createOrder)
router.get('/', getOrders)
router.get('/:_id', getOrder)
router.put('/', updateOrder)

export default router;