import express, { Router, urlencoded } from "express"
const router = express.Router();
import { validatePantry } from '../middleware.js';
import catchAsync from "../utils/catchAsync.js";
import {isLoggedIn} from "../middleware.js";
import * as pantry from "../controllers/pantry.js";

router.get('/', isLoggedIn, catchAsync(pantry.renderPantry))

router.post('/:category', isLoggedIn, validatePantry, catchAsync(pantry.addItemToPantry))

router.post('/move/:name', isLoggedIn, catchAsync(pantry.moveToSavedItems))
 
router.post('/move-back/:name', isLoggedIn, catchAsync(pantry.moveFromSavedItems))

router.post('/move-to-cart/:name', isLoggedIn, catchAsync())

router.route('/:id')
    .patch(isLoggedIn, validatePantry, catchAsync())
    .delete(isLoggedIn, catchAsync())

export default router;