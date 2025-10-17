import express from 'express';
const router = express.Router();
import passport from 'passport';
import * as users from '../controllers/users.js';

router.route('/register')
    .get(users.renderRegisterForm)
    .post(users.registerUser);

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.post('/demo-login', users.demoLogin);

router.get('/logout', users.logout);

export default router;

