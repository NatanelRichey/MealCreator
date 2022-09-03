import express, { urlencoded } from "express"
const router = express.Router();
import { validateMeal } from '../middleware.js';
import catchAsync from "../utils/catchAsync.js";
import {isLoggedIn} from "../middleware.js"
import * as meals from "../controllers/meals.js";
import multer from 'multer'
import { storage } from '../cloudinary/index.js'
const upload = multer({ storage });
console.log(upload)

router.get('/', isLoggedIn, catchAsync(meals.renderMeals))

router.get('/new', isLoggedIn, meals.renderNewMealForm)

router.post('/new/ingredients', isLoggedIn, meals.addIngredientToForm)

router.delete('/new/ingredients/:ingredient', isLoggedIn, catchAsync (meals.removeIngredientFromForm))

router.post("/new/tags/:choice", isLoggedIn, meals.addTagToForm)

router.post('/new/name-img', isLoggedIn, validateMeal, catchAsync(meals.addMeal))

router.post('/edit/ingredients', isLoggedIn, meals.editIngredients)

router.delete('/edit/ingredients/:ingredient', isLoggedIn, catchAsync(meals.deleteIngredients))

router.post("/edit/tags/:choice", isLoggedIn, meals.editTags)

router.post('/edit/all/:name', isLoggedIn, catchAsync(meals.renderEditMealForm))

router.patch('/edit/name-img/:name', isLoggedIn, validateMeal, catchAsync(meals.editMeal))

router.route('/:id')
    .patch(isLoggedIn, catchAsync(meals.editMealName))
    .delete(isLoggedIn, catchAsync(meals.deleteMeal))

export default router;