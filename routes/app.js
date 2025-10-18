import express from 'express';
const router = express.Router();
import * as app from '../controllers/app.js';
import { isLoggedIn } from '../middleware.js';

router.get('/', isLoggedIn, app.renderApp);

router.get('/home', app.renderHome);

router.get('/selector', isLoggedIn, app.renderMealSelector);

router.post('/find-meals', isLoggedIn, app.processMealSelection);

router.get('/choice/:choice', isLoggedIn, app.processChoice);

export default router;

