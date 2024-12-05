import express from 'express';
import userRoute from './user.js';
import accountRoute from './account.js';

export const router = express.Router();


router.use('/user', userRoute);
router.use('/account', accountRoute);
