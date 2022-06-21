import express from 'express';
import {
    createOrder, getOrder, getOrders, updateOrder,
    paymesReturn
} from '../controllers/order.js';

const router = express.Router();

router.post('/', createOrder)
router.get('/', getOrders)
router.get('/:_id', getOrder)
router.put('/', updateOrder)

router.post('/paymes/return', paymesReturn)


export default router;