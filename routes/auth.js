import express from 'express';
import {
    login,
    getToken,
    updateUser,
    getUser
} from '../controllers/auth.js';

const router = express.Router();

router.post('/login', login)
router.post('/get-token', getToken)
router.post('/update-user', updateUser)
router.get('/get-user', getUser)

export default router;