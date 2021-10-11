import express from 'express';
import {
    createArticle,
    getArticle,
    getArticles,
    updateArticle,
    deleteArticles,
    updateArticles
} from '../controllers/article.js';

const router = express.Router();

router.get('/', getArticles)

router.get('/:_id', getArticle)

router.post('/', createArticle)

router.put('/:_id', updateArticle)

router.put('/', updateArticles)

router.delete('/', deleteArticles)

export default router;