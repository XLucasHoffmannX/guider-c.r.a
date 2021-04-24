const passport = require('passport')

const accessCtrl = {
    // home
    accessHome : (req, res)=>{ res.render('./access/access') },
    // register
    registerGet: (req, res)=>{ res.render('./access/register') },
    
    registerPost: passport.authenticate('local-register', {
        successRedirect: '/feed/',
        failureRedirect: '/access/register',
        passReqToCallback: true
    }),    
    // login
    loginGet: (req, res)=>{ res.render('./access/login') },

    loginPost: passport.authenticate('local-login', {
        successRedirect: '/feed/',
        failureRedirect: '/access/login',
        passReqToCallback: true
    }),
    //
}

module.exports = accessCtrl