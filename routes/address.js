import express from 'express';
import {
    createAddress,
    getAddresses
} from '../controllers/address.js';

const router = express.Router();

router.post('/', createAddress)
router.get('/', getAddresses)

export default router;