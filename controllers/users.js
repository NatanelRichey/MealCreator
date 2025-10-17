import User from "../models/user.js";

export const renderRegisterForm = (req, res) => {
    res.render('users/register');
}

export const registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Meal Creator!');
            res.redirect('/app');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

export const renderLoginForm =  (req, res) => {
    res.render('users/login');
}

export const login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || "/app";
    // console.log(redirectUrl)
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

export const logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/login');
      });
}

export const demoLogin = async (req, res, next) => {
    try {
        // Check if demo user exists
        const demoUser = await User.findOne({ username: 'demo' });
        
        if (!demoUser) {
            req.flash('error', 'Demo account not found. Please run the seed script first.');
            return res.redirect('/login');
        }
        
        // Authenticate the demo user
        req.login(demoUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to the Demo Account! Feel free to explore!');
            res.redirect('/app');
        });
    } catch (e) {
        req.flash('error', 'Error logging into demo account');
        res.redirect('/login');
    }
}