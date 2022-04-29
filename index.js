import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import ejs from 'ejs';

import {
    addressRoutes,
    authRoutes,
    cartRoutes,
    categoryRoutes,
    orderRoutes,
    productRoutes,
    searchRoutes
} from './routes/index.js';

import handleErrors from './middlewares/handleErrors.js';

import { __dirname } from './constants.js';
import authToken from './middlewares/authToken.js';


const app = express();

dotenv.config();

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use(express.static('public'))

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

const URL_PATTERN = '/' + process.env.BACKEND_APP_VERSION;

app.use(URL_PATTERN + '/auth', authToken, authRoutes);

app.use(URL_PATTERN + '/search', authToken, searchRoutes);
app.use(URL_PATTERN + '/categories', categoryRoutes);
app.use(URL_PATTERN + '/products', productRoutes);

app.use(URL_PATTERN + '/cart', authToken, cartRoutes);
app.use(URL_PATTERN + '/order', authToken, orderRoutes);
app.use(URL_PATTERN + '/address', authToken, addressRoutes);

app.use(handleErrors);


const CONNECTION_URL = process.env.DB_URL;
const PORT = process.env.PORT || 5002;

const OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(CONNECTION_URL, OPTIONS)
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch(err => console.log(err.message));
