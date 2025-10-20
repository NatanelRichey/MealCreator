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
    // console.log(req.body);
    if (error) {
        req.flash('error', `Enter item name`);
        res.redirect('/pantry')
    } else {
        next();
    }
}

export const validateList = (req, res, next) => {
    const { error } = shoppingListSchema.validate(req.body);
    // console.log(req.body);
    if (error) {
        req.flash('error', `Enter item name`);
        res.redirect('/list')
    } else {
        next();
    }
}

export const isLoggedIn = (req, res, next) => {
    console.log('🔒 isLoggedIn middleware - Path:', req.path);
    console.log('🍪 Session ID:', req.sessionID);
    console.log('👤 Authenticated:', req.isAuthenticated());
    console.log('👤 User:', req.user?.username || 'none');
    
    if (!req.isAuthenticated()) {
        // Check if this is an API request (starts with /api)
        if (req.path.startsWith('/api')) {
            console.log('❌ Not authenticated - returning 401 JSON error');
            return res.status(401).json({ 
                error: 'Authentication required',
                message: 'You must be signed in first!'
            });
        }
        
        // For non-API requests, redirect to login
        console.log('❌ Not authenticated - redirecting to login');
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    
    console.log('✅ Authentication passed');
    next();
}