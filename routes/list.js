import express, { urlencoded } from "express"
const router = express.Router();
import { validateList } from '../middleware.js';
import catchAsync from "../utils/catchAsync.js"
import {isLoggedIn} from "../middleware.js"
import * as list from "../controllers/list.js";

const shoppingCategories = ["Vegetables", "Fruits", "Grains & Pasta", "Dairy", "Fish & Eggs", "Fats & Oils", "Condiments", "Freezer", "Miscellaneous"]

router.get('/',  isLoggedIn, catchAsync (list.renderList))

router.post('/move-to-pantry/:name',  isLoggedIn, catchAsync(list.moveToPantry))

router.post('/:category',  isLoggedIn, validateList, catchAsync(list.addToList))

router.route('/:id')
    .patch(validateList, isLoggedIn, catchAsync(list.updateItemName))
    .delete(isLoggedIn, catchAsync(list.deleteFromList))

export default router;