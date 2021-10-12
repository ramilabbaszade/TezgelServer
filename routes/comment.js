import express from 'express';
import {
    createComment,
    getComment,
    getComments,
    updateComment,
    deleteComments,
    updateComments
} from '../controllers/comment.js';

const router = express.Router();

router.get('/', getComments)

router.get('/:_id', getComment)

router.post('/', createComment)

router.put('/:_id', updateComment)

router.put('/', updateComments)

router.delete('/', deleteComments)

export default router;