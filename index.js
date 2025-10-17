// -------------------------------------------------------- IMPORTS AND DECLARATIONS -------------------------------------------------------
import {} from 'dotenv/config'

import express from "express"
const app = express()

import pkg  from 'mongoose';
const { connect } = pkg

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

const dbUrl = process.env.DB_URL || "mongodb+srv://natanelrichey:jA78gKsDQWh4shU@cluster0.rxrufjj.mongodb.net/mealcreator?retryWrites=true&w=majority"
connect(dbUrl, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("CONNECTION OPEN")
    })
    .catch(err => {
        console.log("CONNECTION ERROR")
        console.log(err)
    })

// ------------------------------------------------------------ SESSIONS & FLASH ------------------------------------------------------------

import session from 'express-session'
import { ServerApiVersion } from 'mongodb'
import { default as connectMongoDBSession} from 'connect-mongodb-session';
const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore ({
    uri: dbUrl,
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1, 
    collection: 'sessions'
})

store.on("error", function (e) {
    console.log("SESSION STORE ERROR")
})

const secret = process.env.secret || "fEdfg23@fgRTh6^%$ttdfVC234"

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

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

app.listen(port, () => {
    console.log(`APP IS LISTENING ON PORT ${port}!`)
})

export default curUser