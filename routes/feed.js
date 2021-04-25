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
        const tasks = await Task.find();

        const userGuiders = []
        const userTasks = []
        const userId = user.id;

        for (let guider of guiders) if (userId == guider.userTo) userGuiders.push(guider);

        for (let guider of userGuiders){ 
            for(let task of tasks){
                if(task.guider == guider.id && task.assignedTo == userId){
                    userTasks.push(task)
                }
            }
        }  

        const numberTasks = userTasks.length
        
        return res.render('./feed/feed', { userGuiders, numberTasks})
    } catch (error) {
        if (error) throw error
    }
})

router.post('/', async (req, res) => {
    try {
        const user = req.user
        const { title, description } = req.body;

        const newGuider = new Guider({
            title, description, userTo: user.id
        })

        await newGuider.save();

        return res.redirect('/feed/')
    } catch (error) {
        if (error) throw error
    }
})

router.delete('/:id', async (req, res)=>{
    try {
        await Guider.findByIdAndDelete(req.params.id)

        return res.redirect('/feed')
    } catch (error) {
        if(error) throw error
    }
})

router.get('/edit/:id', async(req, res)=>{
    try {
        const guider = await Guider.findById(req.params.id);

        return res.render('./feed/pages/edit', { guider })
    } catch (error) {
        if(error) throw error
    }
})

router.put('/edit/:id', async(req, res)=>{
    try {
        let guider = await Guider.findById(req.params.id);
        guider.title = req.body.title;
        guider.description = req.body.description;

        guider = await guider.save();
        return res.redirect('/feed')
    } catch (error) {
        if(error) throw error
    }
})

// View guider
router.get('/guider/:guiderId', async (req, res) => {
    try {
        const user = req.user
        const guider = await Guider.findById(req.params.guiderId)
        const tasks = await Task.find();

        const userId = user.id
        const guiderId = guider.id
        const tasksUser = [];
        
        for(let task of tasks){
            if(task.guider == guiderId && task.assignedTo == userId){
                tasksUser.push(task)
            }
        }

        return res.render('./feed/pages/guider', { guider, tasksUser })
    } catch (error) {
        if (error) throw error
    }
})

router.post('/guider/:guiderId', async (req, res) => {
    try {
        const user = req.user
        const guiderId = req.params.guiderId
        const { protocol, type } = req.body

        const newTask = new Task({
            protocol, type,
            guider: guiderId,
            assignedTo: user
        })

        await newTask.save();

        res.redirect('back')
    } catch (error) {
        if(error) throw error
    }
})

let succesEdit;

router.get('/guider/edit/:id', async(req, res)=>{
    try {
        const task = await Task.findById(req.params.id);

        res.render('./feed/pages/tasks/editTask', { task })
    } catch (error) {
        if(error) throw error
    }
})


router.put('/guider/edit/:id', async(req, res, next)=>{
    try {
        let task = await Task.findById(req.params.id);
        task.protocol = req.body.protocol;
        task.type = req.body.type;

        await task.save();

        req.flash('editMessage', "Editado! Volte para a página anterior e renicie !")
        
        res.redirect(`/feed/guider/edit/${req.params.id}`)
    } catch (error) {
        if(error) throw error
    }
})

router.delete('/guider/delTask/:id', async(req, res)=>{
    try {
        await Task.findByIdAndDelete(req.params.id);

        return res.redirect('back')
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