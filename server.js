require('dotenv').config();
// dependencies externs
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const mongoose = require('mongoose');
// app 
const app = express();

require('./middlewares/auth')

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next)=>{
    app.locals.registerMessage = req.flash('registerMessage');
    app.locals.loginMessage = req.flash('loginMessage');
    app.locals.user = req.user;
    next()
})

// routes
app.use('/', require('./routes/index'));
app.use('/access', require('./routes/accessRouter'));
app.use('/feed', require('./routes/feed'))

// connect cluster
const URI = process.env.MONGO_CONNECT
mongoose.connect(URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}, err=>{
    if(err) throw err;
    console.log('Conectado ao Cluster')
});

const PORT = process.env.PORT || 4040;
app.listen(PORT, console.log(`Server in on port ${PORT}`))