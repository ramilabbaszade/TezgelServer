import express from 'express';
import {
    getProducts,
} from '../controllers/product.js';

const router = express.Router();

router.get('/', getProducts)

// router.get('/:_id', getProduct)

// router.post('/', createProduct)

// router.put('/:_id', updateProduct)
// router.put('/', updateProducts)

// router.delete('/', deleteProducts)

export default router;