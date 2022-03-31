import express from 'express';
import {
    updateCart,
    getCart,
    deleteCart
} from '../controllers/cart.js';

const router = express.Router();

router.get('/', getCart)
router.put('/', updateCart)
router.delete('/', deleteCart)

export default router;