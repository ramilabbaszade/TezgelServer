import Order from '../models/order.js';
import Product from '../models/product.js';
import Courier from '../models/courier.js'
import Warehouse from '../models/warehouse.js';
import { NotAuthorized, NotFound, BadRequest } from '../utils/errors.js';
import Setting from '../models/setting.js';
import New from '../models/new.js'
import Campaign from '../models/campaign.js'


const getEntity = (entity) => {
    switch (entity) {
        case 'product':
            return Product
        case 'order':
            return Order
        case 'courier':
            return Courier
        case 'warehouse':
            return Warehouse
        case 'setting':
            return Setting
        case 'new':
            return New
        case 'campaign':
            return Campaign
        default:
            throw new BadRequest('Entity not found!')
    }
}

export const search = async (req, res, next) => {
    try {
        const auth = req.currentUser;
        
        const {entity} = req.params;

        if (!auth) {
            if (entity === 'order') throw new NotAuthorized('Zəhmət olmasa, daxil olun.');
            if (entity === 'courier') throw new NotAuthorized('Zəhmət olmasa, daxil olun.');
            if (entity === 'warehouse') throw new NotAuthorized('Zəhmət olmasa, daxil olun.');
        }
        let { filter, select, populate, limit, skip, sort } = req.body;

        if (!skip) skip = 0;
        if (!limit) limit = 10;

        const Entity = getEntity(entity)

        const count = await Entity.find(filter).count()

        const data = await Entity.find(filter)
            .select(select).populate(populate).limit(limit).skip(skip).sort(sort)

        return res.json({ status: 'success', data, filter, select, populate, limit, skip, count, sort })
    } catch (error) {
        next(error)
    }
}
