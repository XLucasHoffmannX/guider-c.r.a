const router = require('express').Router();

const accessCtrl = require('../controllers/accessCtrl')

const passport = require('passport')

router.get('/', accessCtrl.accessHome)

// register
router.get('/register', accessCtrl.registerGet)

router.post('/register', accessCtrl.registerPost)

// login
router.get('/login', accessCtrl.loginGet)

router.post('/login', accessCtrl.loginPost)

// logout movido para feedCtrl

module.exports = router