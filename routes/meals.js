import express from 'express';
const router = express.Router();
import multer from 'multer';
import { storage } from '../cloudinary/index.js';
const upload = multer({ storage });
import * as meals from '../controllers/meals.js';
import { isLoggedIn, validateMeal } from '../middleware.js';

router.get('/', isLoggedIn, meals.renderMeals);

router.get('/new', isLoggedIn, meals.renderNewMealForm);

router.post('/new/:name', isLoggedIn, upload.single('imgSrc'), validateMeal, meals.addMeal);

router.get('/edit/all/:name', isLoggedIn, meals.renderEditMealForm);

router.put('/edit/all/:name', isLoggedIn, upload.single('imgSrc'), validateMeal, meals.editMeal);

router.patch('/edit/name/:id', isLoggedIn, validateMeal, meals.editMealName);

router.put('/new/add-ingredient/:name/:status', isLoggedIn, meals.addIngredientToForm);

router.put('/new/add-name/:name/:status', isLoggedIn, meals.addNameToForm);

router.delete('/new/remove-ingredient/:ingredient/:name/:status', isLoggedIn, meals.deleteIngredients);

router.put('/new/toggle-tag/:choice/:name/:status', isLoggedIn, meals.toggleTags);

router.delete('/delete/:id', isLoggedIn, meals.deleteMeal);

export default router;

