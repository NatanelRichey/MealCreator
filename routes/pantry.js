import express from 'express';
const router = express.Router();
import * as pantry from '../controllers/pantry.js';
import { isLoggedIn, validatePantry } from '../middleware.js';

router.get('/', isLoggedIn, pantry.renderPantry);

router.post('/add-item/:category', isLoggedIn, validatePantry, pantry.addItemToPantry);

router.put('/move-to-saved/:name', isLoggedIn, pantry.moveToSavedItems);

router.put('/move-from-saved/:name', isLoggedIn, pantry.moveFromSavedItems);

router.put('/move-to-cart/:name', isLoggedIn, pantry.moveToCart);

router.patch('/edit/:id', isLoggedIn, validatePantry, pantry.editPantryItemName);

router.delete('/delete/:id', isLoggedIn, pantry.deleteItem);

export default router;

