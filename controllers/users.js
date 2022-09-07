import User from "../models/user.js";

export const renderRegisterForm = (req, res) => {
    res.render('users/register');
}

export const registerUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username });
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