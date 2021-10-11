import express from 'express';
import {
    createOffer,
    getOffer,
    getOffers,
    updateOffer,
    deleteOffers,
    updateOffers
} from '../controllers/offer.js';

const router = express.Router();

router.get('/', getOffers)

router.get('/:_id', getOffer)

router.post('/', createOffer)

router.put('/:_id', updateOffer)

router.put('/', updateOffers)

router.delete('/', deleteOffers)

export default router;