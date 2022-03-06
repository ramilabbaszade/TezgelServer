import express from 'express';
import {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategories,
    updateCategories,
} from '../controllers/category.js';

const router = express.Router();

router.get('/', getCategories)


router.post('/', createCategory)

router.put('/:_id', updateCategory)

router.put('/', updateCategories)

router.delete('/', deleteCategories)



export default router;