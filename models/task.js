const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    protocol: {
        type: String,
        default: 'Não informado'
    },
    type: {
        type: String,
        required: true
    },
    guider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guider',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
