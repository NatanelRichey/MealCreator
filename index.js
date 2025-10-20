// -------------------------------------------------------- IMPORTS AND DECLARATIONS -------------------------------------------------------
import {} from 'dotenv/config'

import express from "express"
const app = express()

import pkg  from 'mongoose';
const { connect } = pkg

import cors from 'cors'

// CORS MUST be the FIRST middleware for preflight to work!
const corsOptions = {
    origin: function (origin, callback) {
        console.log('🌐 CORS check for origin:', origin);
        
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) {
            console.log('✅ Allowing request with no origin');
            return callback(null, true);
        }
        
        // Allow localhost for development
        if (origin && origin.includes('localhost')) {
            console.log('✅ Allowing localhost origin');
            return callback(null, true);
        }
        
        // Allow any onrender.com subdomain (your deployed apps)
        if (origin && origin.endsWith('.onrender.com')) {
            console.log('✅ Allowing onrender.com origin');
            return callback(null, true);
        }
        
        console.log('❌ CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

console.log('🌐 Setting up CORS middleware...');
app.use(cors(corsOptions));
app.options('*', (req, res) => {
    console.log('✈️  OPTIONS request received for:', req.path);
    cors(corsOptions)(req, res, () => {
        res.sendStatus(204);
    });
});

import methodOverride from "method-override"
app.use(methodOverride('_method'))

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import path, { join } from "path"
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', join(__dirname, 'views'));

import bodyParser from 'body-parser'
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));

// --------------------------------------------------------- EXPRESS INITIALIZATIONS --------------------------------------------------------

const dbUrl = process.env.DB_URL

// Check if DB_URL is set
if (!dbUrl) {
    console.error('❌ FATAL ERROR: DB_URL environment variable is not set!');
    console.error('Please set DB_URL in your Render environment variables.');
    process.exit(1);
}

console.log('🔌 Attempting to connect to MongoDB...');
console.log('📍 DB URL starts with:', dbUrl.substring(0, 20) + '...');

connect(dbUrl, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("✅ MongoDB CONNECTION OPEN - Database connected successfully!")
    })
    .catch(err => {
        console.error("❌ MongoDB CONNECTION ERROR - Failed to connect to database!")
        console.error("Error details:", err.message)
        console.error("Full error:", err)
        process.exit(1);
    })

// ------------------------------------------------------------ SESSIONS & FLASH ------------------------------------------------------------

import session from 'express-session'
import MongoStore from 'connect-mongo'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600, // lazy session update
    crypto: {
        secret: process.env.SECRET
    }
})

store.on("error", function (e) {
    console.log("SESSION STORE ERROR:", e)
})

const secret = process.env.SECRET

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true, // Create session immediately for cross-origin to work
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Require HTTPS in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Allow cross-origin in production
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined // Allow subdomain cookies
    }
}

console.log('🍪 Session configuration:');
console.log('  - secure:', sessionConfig.cookie.secure);
console.log('  - sameSite:', sessionConfig.cookie.sameSite);
console.log('  - domain:', sessionConfig.cookie.domain);

app.use(session(sessionConfig));

import flash from "connect-flash"
app.use(flash());

import passport from 'passport'
import LocalStrategy from 'passport-local'

import User from './models/user.js'

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

let curUser = ""

app.use((req, res, next) => {
    res.locals.currentUser = req.user || ""
    curUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.curUrl = req.url;
    next();
})

// -------------------------------------------------------------- ROUTES --------------------------------------------------------------------

import pantryRoutes from "./routes/pantry.js";
import listRoutes from "./routes/list.js";
import mealsRoutes from "./routes/meals.js";
import appRoutes from "./routes/app.js";
import usersRoutes from "./routes/users.js";
import apiRoutes from "./routes/api.js";

app.use('/api', apiRoutes)  // JSON API routes for React
app.use('/app', appRoutes)
app.use('/pantry', pantryRoutes)
app.use('/shopping-list', listRoutes)
app.use('/meals', mealsRoutes)
app.use('/', usersRoutes)

app.get('/', (req, res) => {
    res.render('users/login')
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000
const host = process.env.HOST || '0.0.0.0'

app.listen(port, host, () => {
    console.log(`APP IS LISTENING ON ${host}:${port}!`)
})

export default curUser