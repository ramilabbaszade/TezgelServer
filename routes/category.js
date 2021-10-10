import express from 'express';
import {
    createCategory,
    getCategory,
    getCategories,
    updateCategory,
    deleteCategories,
    updateCategories
} from '../controllers/category.js';

const router = express.Router();

router.get('/', getCategories)

router.get('/:_id', getCategory)

router.post('/', createCategory)

router.put('/:_id', updateCategory)

router.put('/', updateCategories)

router.delete('/', deleteCategories)

export default router;