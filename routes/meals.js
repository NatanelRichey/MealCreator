import express, { urlencoded } from "express"
const router = express.Router();
import { validateMeal } from '../middleware.js';
import catchAsync from "../utils/catchAsync.js";
import {isLoggedIn} from "../middleware.js"
import * as meals from "../controllers/meals.js";
import multer from 'multer'
import { storage } from '../cloudinary/index.js'
const upload = multer({ storage });

router.get('/', isLoggedIn, catchAsync(meals.renderMeals))

router.get('/new', isLoggedIn, meals.renderNewMealForm)

router.post('/new/ingredients/:name/:status', isLoggedIn, meals.addIngredientToForm)

router.delete('/new/ingredients/:ingredient/:name/:status', isLoggedIn, catchAsync (meals.deleteIngredients))

router.post("/new/tags/:choice/:name/:status", isLoggedIn, meals.toggleTags)

router.post('/new/name-img', isLoggedIn, upload.single("imgSrc"), validateMeal, catchAsync(meals.addMeal))

router.post('/edit/ingredients/:name/:status', isLoggedIn, meals.addIngredientToForm)

router.delete('/edit/ingredients/:ingredient/:name/:status', isLoggedIn, catchAsync(meals.deleteIngredients))

router.post("/edit/tags/:choice/:name/:status", isLoggedIn, meals.toggleTags)

router.post('/edit/all/:name', isLoggedIn, catchAsync(meals.renderEditMealForm))

router.patch('/edit/name-img/:name', isLoggedIn, upload.single("imgSrc"), validateMeal, catchAsync(meals.editMeal))

router.route('/:id')
    .patch(isLoggedIn, catchAsync(meals.editMealName))
    .delete(isLoggedIn, catchAsync(meals.deleteMeal))

export default router;