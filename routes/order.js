import express from 'express';
import {
    createOrder, getOrder, getOrders, updateOrder,
    paymesReturn, calculateCourier
} from '../controllers/order.js';

const router = express.Router();

router.post('/', createOrder)
router.get('/', getOrders)
router.get('/:_id', getOrder)
router.put('/', updateOrder)
router.post('/courier-cost', calculateCourier)
router.post('/paymes/return', paymesReturn)


export default router;