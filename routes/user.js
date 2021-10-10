import express from 'express';
import {
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUsers
} from '../controllers/user.js';

const router = express.Router();

router.get('/', getUsers)

router.get('/:_id', getUser)

router.post('/', createUser)

router.put('/:_id', updateUser)

router.delete('/', deleteUsers)

export default router;