import express from 'express';
import {
    createAddress,
    getAddresses,
    putAddress,
    removeAddress
} from '../controllers/address.js';

const router = express.Router();

router.post('/', createAddress)
router.get('/', getAddresses)
router.put('/', putAddress)
router.delete('/', removeAddress)

export default router;