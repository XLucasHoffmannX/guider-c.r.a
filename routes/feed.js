const router = require('express').Router();
const mongoose = require('mongoose');

delete mongoose.connection.models['User']; // pq ja compilou uma vez

const Guider = require('../models/guider')
const Task = require('../models/task'); 

// logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
})

// Middleware
router.use((req, res, next) => {
    isAuthenticated(req, res, next)
})


//  Home
router.get('/', async (req, res) => {
    try {
        const user = req.user
        const guiders = await Guider.find()
        
        const userGuiders = []
        const userId = user.id;

        for(let guider of guiders) if(userId == guider.userTo) userGuiders.push(guider);

        return res.render('./feed/feed' , { userGuiders } )
    } catch (error) {
        if (error) throw error
    }
})

router.post('/', async (req, res)=>{
    try {
        const user = req.user
        const { title, description } = req.body;

        const newGuider = new Guider({
            title, description, userTo: user.id
        })

        await newGuider.save(); 

        return res.redirect('/feed/')
    } catch (error) {
        if(error) throw error
    }
})

// profile
router.get('/profile', (req, res) => {
    res.render('./feed/pages/profile')
})

// auth
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/access/login')
}

module.exports = router