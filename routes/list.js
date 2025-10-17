import express from 'express';
const router = express.Router();
import * as list from '../controllers/list.js';
import { isLoggedIn, validateList } from '../middleware.js';

router.get('/', isLoggedIn, list.renderList);

router.post('/add-item/:category', isLoggedIn, validateList, list.addToList);

router.put('/move-to-pantry/:name', isLoggedIn, list.moveToPantry);

router.put('/edit/:id', isLoggedIn, validateList, list.updateItemName);

router.delete('/delete/:id', isLoggedIn, list.deleteFromList);

export default router;

