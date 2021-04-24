const mongoose = require('mongoose');

const GuiderModel = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    userTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Guider = mongoose.model('Guider', GuiderModel);

module.exports = Guider