import express from "express"
const router = express.Router();
import passport from "passport"
import catchAsync from "../utils/catchAsync.js"
import * as users from "../controllers/users.js";

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.registerUser));

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), users.login)

router.get('/logout', users.logout)

export default router