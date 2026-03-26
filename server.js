const express = require('express')
const path = require('path')
const mongo = require('./usermodel/mongocon')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const config = require('config');
const passport = require('./config/passport');

const userrouter = require('./routes/userRouter')
const authRouter = require('./routes/authRouter');
const states = require('./routes/states');
const admin = require('./routes/admin');
const maps = require('./routes/map');
const journal = require('./routes/journal')
const travelsumm = require('./routes/travelSumm')
const destination = require('./routes/destination');
const cookieParser = require('cookie-parser')

const app = express();
app.set("view engine", 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser());

// Session configuration
app.use(session({
    secret: config.get('private_key'),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Mount routers
app.use(authRouter);
app.use(maps);
app.use(states);
app.use(admin);
app.use(journal);
app.use(travelsumm);
app.use(userrouter);
app.use(destination);

app.listen(3000);
