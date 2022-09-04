import { mealSchema, pantrySchema, shoppingListSchema } from './schemas.js'

export const validateMeal = (req, res, next) => {
    const { error } = mealSchema.validate(req.body);
    if (error) {
        req.flash('error', `Enter meal name`);
        res.redirect('/meals')
    } else {
        next();
    }
}

export const validatePantry = (req, res, next) => {
    const { error } = pantrySchema.validate(req.body);
    console.log(req.body);
    if (error) {
        req.flash('error', `Enter item name`);
        res.redirect('/pantry')
    } else {
        next();
    }
}

export const validateList = (req, res, next) => {
    const { error } = shoppingListSchema.validate(req.body);
    console.log(req.body);
    if (error) {
        req.flash('error', `Enter item name`);
        res.redirect('/list')
    } else {
        next();
    }
}

export const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}